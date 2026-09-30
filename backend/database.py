import hashlib
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone

from config import DB_PATH


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _hash_password(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        120_000,
    ).hex()


def hash_password(password: str) -> tuple[str, str]:
    salt = secrets.token_hex(16)
    return _hash_password(password, salt), salt


def verify_password(password: str, password_hash: str, salt: str) -> bool:
    return secrets.compare_digest(_hash_password(password, salt), password_hash)


def init_db():
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                full_name TEXT NOT NULL,
                mobile TEXT NOT NULL UNIQUE,
                email TEXT,
                password_hash TEXT NOT NULL,
                password_salt TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                full_name TEXT NOT NULL,
                identity_number TEXT NOT NULL,
                occupation_type TEXT NOT NULL,
                earning_mode TEXT NOT NULL,
                account_number TEXT NOT NULL,
                upi_id TEXT NOT NULL,
                requested_amount INTEGER NOT NULL,
                status TEXT NOT NULL,
                current_stage TEXT NOT NULL,
                review_note TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS status_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                application_id TEXT NOT NULL,
                label TEXT NOT NULL,
                state TEXT NOT NULL,
                event_date TEXT NOT NULL,
                FOREIGN KEY(application_id) REFERENCES applications(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS weekly_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                day_label TEXT NOT NULL,
                volume INTEGER NOT NULL,
                sales INTEGER NOT NULL,
                sort_order INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS social_security_profiles (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                overdraft_used INTEGER NOT NULL,
                overdraft_limit INTEGER NOT NULL,
                contribution_streak INTEGER NOT NULL,
                daily_contribution INTEGER NOT NULL,
                estimated_corpus INTEGER NOT NULL,
                retirement_pension INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS upi_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_id TEXT NOT NULL DEFAULT 'DEMO-VENDOR',
                txn_date TEXT NOT NULL,
                amount REAL NOT NULL,
                customer_id TEXT NOT NULL,
                txn_type TEXT NOT NULL DEFAULT 'credit'
            );

            CREATE TABLE IF NOT EXISTS kyc_documents (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                document_type TEXT NOT NULL,
                status TEXT NOT NULL,
                file_name TEXT NOT NULL,
                stored_name TEXT NOT NULL,
                content_type TEXT NOT NULL,
                size_bytes INTEGER NOT NULL,
                sha256 TEXT NOT NULL,
                rejection_reason TEXT,
                submitted_at TEXT NOT NULL,
                reviewed_at TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id
            ON kyc_documents(user_id, submitted_at DESC);

            CREATE TABLE IF NOT EXISTS upi_history_transactions (
                transaction_id TEXT PRIMARY KEY,
                upi_id TEXT NOT NULL,
                amount REAL NOT NULL,
                currency TEXT DEFAULT 'INR',
                merchant_name TEXT NOT NULL,
                payment_status TEXT NOT NULL,
                transaction_date TEXT NOT NULL,
                payment_remarks TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_upi_history_transactions_vpa
            ON upi_history_transactions(upi_id);

            CREATE TABLE IF NOT EXISTS rag_sources (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                source_type TEXT NOT NULL CHECK (source_type IN ('rbi', 'government_scheme', 'lender_policy', 'app_policy')),
                official_url TEXT NOT NULL,
                effective_from TEXT,
                last_reviewed TEXT NOT NULL,
                language TEXT NOT NULL DEFAULT 'en',
                status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'superseded', 'draft')),
                content_sha256 TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS rag_chunks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_id TEXT NOT NULL,
                chunk_index INTEGER NOT NULL,
                content TEXT NOT NULL,
                token_count INTEGER NOT NULL,
                FOREIGN KEY(source_id) REFERENCES rag_sources(id) ON DELETE CASCADE,
                UNIQUE(source_id, chunk_index)
            );
            CREATE INDEX IF NOT EXISTS idx_rag_chunks_source ON rag_chunks(source_id);

            CREATE TABLE IF NOT EXISTS ai_conversations (
                session_id TEXT PRIMARY KEY,
                user_name TEXT DEFAULT 'Anonymous Worker',
                language TEXT DEFAULT 'en',
                status TEXT DEFAULT 'active',
                message_count INTEGER DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_ai_conversations_created ON ai_conversations(created_at DESC);
            """
        )
        conn.commit()
        _migrate_user_location(conn)
        _migrate_upi_transactions(conn)
        _migrate_ai_conversations(conn)
        _seed_demo_data(conn)


def _migrate_upi_transactions(conn: sqlite3.Connection):
    tables = {
        row[0]
        for row in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        ).fetchall()
    }
    if "upi_transactions" not in tables:
        conn.execute(
            """
            CREATE TABLE upi_transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_id TEXT NOT NULL DEFAULT 'DEMO-VENDOR',
                txn_date TEXT NOT NULL,
                amount REAL NOT NULL,
                customer_id TEXT NOT NULL,
                txn_type TEXT NOT NULL DEFAULT 'credit'
            )
            """
        )
        conn.commit()


def _migrate_user_location(conn: sqlite3.Connection):
    columns = {row[1] for row in conn.execute("PRAGMA table_info(users)").fetchall()}
    if "latitude" not in columns:
        conn.execute("ALTER TABLE users ADD COLUMN latitude REAL")
    if "longitude" not in columns:
        conn.execute("ALTER TABLE users ADD COLUMN longitude REAL")
    if "area" not in columns:
        conn.execute("ALTER TABLE users ADD COLUMN area TEXT")
    conn.commit()


def _seed_demo_data(conn: sqlite3.Connection):
    tx_count = conn.execute("SELECT COUNT(*) FROM weekly_transactions").fetchone()[0]
    if tx_count == 0:
        volumes = [82, 91, 68, 95, 88, 100, 74]
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        conn.executemany(
            """
            INSERT INTO weekly_transactions (day_label, volume, sales, sort_order)
            VALUES (?, ?, ?, ?)
            """,
            [
                (day, volume, volume * 62, index)
                for index, (day, volume) in enumerate(zip(days, volumes))
            ],
        )

    profile_count = conn.execute("SELECT COUNT(*) FROM social_security_profiles").fetchone()[0]
    if profile_count == 0:
        conn.execute(
            """
            INSERT INTO social_security_profiles (
                id, overdraft_used, overdraft_limit, contribution_streak,
                daily_contribution, estimated_corpus, retirement_pension
            ) VALUES (1, 3200, 10000, 47, 3, 87600, 3000)
            """
        )

    demo_app = conn.execute(
        "SELECT id FROM applications WHERE id = ?", ("SAH-DEMO001",)
    ).fetchone()
    if not demo_app:
        now = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
        timeline = [
            ("Submitted", "done", "22 Jun"),
            ("e-KYC verified", "done", "23 Jun"),
            ("NBFC review", "active", "Today"),
            ("Bank sanction", "idle", "Pending"),
            ("Cash disbursed", "idle", "Pending"),
        ]
        conn.execute(
            """
            INSERT INTO applications (
                id, user_id, full_name, identity_number, occupation_type, earning_mode,
                account_number, upi_id, requested_amount, status, current_stage,
                review_note, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "SAH-DEMO001",
                None,
                "Ramesh Kumar",
                "XXXX-XXXX-1234",
                "Gig worker",
                "UPI / digital payments",
                "****4521",
                "ramesh@upi",
                15000,
                "in_review",
                "NBFC review",
                "UPI transaction history check ho rahi hai. Expected: 24 ghante.",
                now,
                now,
            ),
        )
        conn.executemany(
            """
            INSERT INTO status_events (application_id, label, state, event_date)
            VALUES (?, ?, ?, ?)
            """,
            [("SAH-DEMO001", label, state, event_date) for label, state, event_date in timeline],
        )

    _seed_upi_transactions(conn)
    _seed_ai_conversations(conn)
    conn.commit()


def _seed_ai_conversations(conn: sqlite3.Connection):
    count = conn.execute("SELECT COUNT(*) FROM ai_conversations").fetchone()[0]
    if count < 6:
        now = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
        conn.execute("DELETE FROM ai_conversations")
        conn.executemany(
            """
            INSERT INTO ai_conversations (session_id, user_name, language, status, message_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            [
                ("CONV-01", "Ramesh Kumar (Delivery Partner)", "hi", "completed", 9, now, now),
                ("CONV-02", "Sunita Devi (Domestic Worker)", "hi", "completed", 9, now, now),
                ("CONV-03", "Kantilal Patel (Street Vendor)", "gu", "completed", 9, now, now),
                ("CONV-04", "Vikram Singh (Construction Laborer)", "hi", "completed", 9, now, now),
                ("CONV-05", "Anita Sharma (Artisan)", "hi", "completed", 9, now, now),
                ("CONV-06", "Mohammad Imran (E-Rickshaw Driver)", "hi", "completed", 9, now, now),
            ]
        )


def _seed_upi_transactions(conn: sqlite3.Connection):
    count = conn.execute("SELECT COUNT(*) FROM upi_transactions").fetchone()[0]
    if count > 0:
        return

    now = datetime.now(timezone.utc)
    profile_id = "DEMO-VENDOR"
    rows: list[tuple] = []
    customers = [f"CUST-{i:03d}" for i in range(1, 41)]
    repeat_pool = customers[:18]

    for day_offset in range(90):
        day = now - timedelta(days=89 - day_offset)
        if day.weekday() == 1 and day_offset % 3 == 0:
            continue

        weekday_factor = 1.35 if day.weekday() in (5, 6) else 0.85 if day.weekday() == 1 else 1.0
        txn_count = int(28 * weekday_factor) + (day_offset % 5)

        for txn_idx in range(txn_count):
            customer = (
                repeat_pool[txn_idx % len(repeat_pool)]
                if txn_idx % 3
                else customers[(txn_idx + day_offset) % len(customers)]
            )
            base = 180 + (txn_idx % 7) * 45
            amount = round(base * weekday_factor, 2)
            txn_time = day.replace(hour=9 + (txn_idx % 10), minute=(txn_idx * 7) % 60)
            rows.append((
                profile_id,
                txn_time.isoformat(timespec="seconds").replace("+00:00", "Z"),
                amount,
                customer,
                "credit",
            ))

    spike_day = (now - timedelta(days=3)).replace(hour=14, minute=22)
    rows.append((
        profile_id,
        spike_day.isoformat(timespec="seconds").replace("+00:00", "Z"),
        200000.0,
        "CUST-NEW-99",
        "credit",
    ))
    rows.append((
        profile_id,
        spike_day.replace(hour=16, minute=5).isoformat(timespec="seconds").replace("+00:00", "Z"),
        185000.0,
        "CUST-NEW-99",
        "debit",
    ))

    conn.executemany(
        """
        INSERT INTO upi_transactions (profile_id, txn_date, amount, customer_id, txn_type)
        VALUES (?, ?, ?, ?, ?)
        """,
        rows,
    )


def _seed_upi_transactions_for_profile(conn: sqlite3.Connection, profile_id: str):
    import random
    from datetime import datetime, timedelta, timezone

    # Generate a deterministic seed based on profile_id hash
    seed_val = int(hashlib.md5(profile_id.encode("utf-8")).hexdigest(), 16) % 1000000
    rng = random.Random(seed_val)

    now = datetime.now(timezone.utc)
    rows: list[tuple] = []
    customers = [f"CUST-{rng.randint(100, 999)}" for _ in range(30)]
    repeat_pool = customers[:12]

    # Generate random features from seed
    base_sales = rng.randint(150, 320)
    daily_avg_txns = rng.randint(18, 32)
    consistency_factor = rng.uniform(0.75, 0.95)

    for day_offset in range(90):
        day = now - timedelta(days=89 - day_offset)
        if day.weekday() == 1 and rng.random() > 0.4:
            continue

        weekday_factor = rng.uniform(1.25, 1.45) if day.weekday() in (5, 6) else rng.uniform(0.78, 0.92) if day.weekday() == 1 else 1.0
        txn_count = int(daily_avg_txns * weekday_factor * consistency_factor) + rng.randint(0, 3)

        for txn_idx in range(txn_count):
            customer = (
                repeat_pool[txn_idx % len(repeat_pool)]
                if rng.random() > 0.45
                else customers[rng.randint(0, len(customers) - 1)]
            )
            amount = round(base_sales * weekday_factor * rng.uniform(0.85, 1.15), 2)
            txn_time = day.replace(hour=8 + rng.randint(0, 12), minute=rng.randint(0, 59))
            rows.append((
                profile_id,
                txn_time.isoformat(timespec="seconds").replace("+00:00", "Z"),
                amount,
                customer,
                "credit",
            ))

    # Occasionally seed a critical warning anomaly
    if rng.random() > 0.4:
        spike_day = (now - timedelta(days=rng.randint(3, 8))).replace(hour=13, minute=rng.randint(10, 50))
        spike_amount = round(base_sales * daily_avg_txns * rng.uniform(4.5, 7.5), 2)
        rows.append((
            profile_id,
            spike_day.isoformat(timespec="seconds").replace("+00:00", "Z"),
            spike_amount,
            "CUST-LARGE-SPIKE",
            "credit",
        ))

    conn.executemany(
        """
        INSERT INTO upi_transactions (profile_id, txn_date, amount, customer_id, txn_type)
        VALUES (?, ?, ?, ?, ?)
        """,
        rows,
    )


def _migrate_ai_conversations(conn: sqlite3.Connection):
    tables = {
        row[0]
        for row in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        ).fetchall()
    }
    if "ai_conversations" not in tables:
        conn.execute(
            """
            CREATE TABLE ai_conversations (
                session_id TEXT PRIMARY KEY,
                user_name TEXT DEFAULT 'Anonymous Worker',
                language TEXT DEFAULT 'en',
                status TEXT DEFAULT 'active',
                message_count INTEGER DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.commit()

    # Ensure baseline 6 conversations are seeded if empty
    count = conn.execute("SELECT COUNT(*) FROM ai_conversations").fetchone()[0]
    if count == 0:
        now = datetime.now(timezone.utc)
        seeds = [
            ("CONV-01", "Ramesh Kumar Patel", "hi", "completed", 8, (now - timedelta(hours=5)).isoformat()),
            ("CONV-02", "Pooja Ben Varma", "gu", "completed", 10, (now - timedelta(hours=4)).isoformat()),
            ("CONV-03", "Suresh Devendra", "en", "completed", 7, (now - timedelta(hours=3)).isoformat()),
            ("CONV-04", "Kavita Devi", "hi", "completed", 9, (now - timedelta(hours=2)).isoformat()),
            ("CONV-05", "Dharmesh Rathod", "gu", "completed", 8, (now - timedelta(hours=1)).isoformat()),
            ("CONV-06", "Anita Sharma", "en", "completed", 6, (now - timedelta(minutes=30)).isoformat()),
        ]
        conn.executemany(
            """
            INSERT INTO ai_conversations (session_id, user_name, language, status, message_count, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            [(s[0], s[1], s[2], s[3], s[4], s[5], s[5]) for s in seeds]
        )
        conn.commit()


def record_ai_conversation_session(
    session_id: str,
    user_name: str = "Anonymous Worker",
    language: str = "en",
    status: str = "active"
) -> dict:
    """
    Record a full AI Conversation Session in the database.
    Increments total count ONLY ONCE per unique session_id (not per message).
    """
    now = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    safe_session = session_id.strip() if session_id else f"CONV-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    with get_connection() as conn:
        existing = conn.execute(
            "SELECT session_id, message_count FROM ai_conversations WHERE session_id = ?",
            (safe_session,)
        ).fetchone()

        if existing:
            # Update existing session message count without creating a new conversation
            conn.execute(
                """
                UPDATE ai_conversations 
                SET message_count = message_count + 1, updated_at = ?, user_name = COALESCE(NULLIF(?, ''), user_name)
                WHERE session_id = ?
                """,
                (now, user_name, safe_session)
            )
            is_new = False
        else:
            # Insert NEW conversation session (+1 to total conversations)
            conn.execute(
                """
                INSERT INTO ai_conversations (session_id, user_name, language, status, message_count, created_at, updated_at)
                VALUES (?, ?, ?, ?, 1, ?, ?)
                """,
                (safe_session, user_name or "Anonymous Worker", language or "en", status, now, now)
            )
            is_new = True
        conn.commit()

        # Get total conversation count
        total_count = conn.execute("SELECT COUNT(*) FROM ai_conversations").fetchone()[0]

    return {
        "session_id": safe_session,
        "is_new_session": is_new,
        "total_conversations": total_count,
        "updated_at": now
    }


def get_ai_conversations_stats() -> dict:
    """Get total count of real full conversations and recent sessions."""
    with get_connection() as conn:
        total_count = conn.execute("SELECT COUNT(*) FROM ai_conversations").fetchone()[0]
        recent_rows = conn.execute(
            """
            SELECT session_id, user_name, language, status, message_count, created_at, updated_at
            FROM ai_conversations
            ORDER BY created_at DESC
            LIMIT 20
            """
        ).fetchall()

    return {
        "total_conversations": total_count,
        "conversations": [dict(r) for r in recent_rows]
    }
