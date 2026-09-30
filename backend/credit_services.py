"""UPI-based credit scoring orchestration layer."""

from datetime import datetime, timezone

from database import get_connection
from ml.anomaly_detector import detect_anomalies
from ml.credit_scorer import score_credit
from ml.flexible_repayment import build_flexible_repayment
from ml.upi_features import extract_upi_features


def _fetch_upi_transactions(profile_id: str = "DEMO-VENDOR") -> list[dict]:
    profile_id = profile_id.strip() if profile_id else "DEMO-VENDOR"
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT txn_date, amount, customer_id, txn_type
            FROM upi_transactions
            WHERE profile_id = ?
            ORDER BY txn_date
            """,
            (profile_id,),
        ).fetchall()

        # Dynamic seeding for new profile IDs
        if not rows:
            from database import _seed_upi_transactions_for_profile
            _seed_upi_transactions_for_profile(conn, profile_id)
            conn.commit()
            rows = conn.execute(
                """
                SELECT txn_date, amount, customer_id, txn_type
                FROM upi_transactions
                WHERE profile_id = ?
                ORDER BY txn_date
                """,
                (profile_id,),
            ).fetchall()

    return [dict(row) for row in rows]


def parse_upi_csv(file_content: bytes, profile_id: str) -> list[dict]:
    import csv
    import io
    from datetime import datetime

    text = file_content.decode("utf-8", errors="ignore")
    f = io.StringIO(text)
    reader = csv.reader(f)
    rows = list(reader)
    if not rows:
        return []

    # Find the header row
    header = None
    header_idx = 0
    for idx, row in enumerate(rows[:10]):
        row_lower = [str(cell).lower() for cell in row]
        if any("date" in cell for cell in row_lower) and any("amount" in cell for cell in row_lower):
            header = row_lower
            header_idx = idx
            break

    if header is None:
        header = [str(cell).lower() for cell in rows[0]]
        header_idx = 0

    # Locate column indices
    date_col = -1
    amount_col = -1
    desc_col = -1
    type_col = -1

    for i, col in enumerate(header):
        if "date" in col:
            date_col = i
        elif "amount" in col or "value" in col or "rupee" in col:
            amount_col = i
        elif any(w in col for w in ["desc", "remark", "particular", "narrative", "payee", "sender", "receiver"]):
            desc_col = i
        elif any(w in col for w in ["type", "cr/dr", "transaction type", "credit/debit"]):
            type_col = i

    # Fallback to standard columns if headers aren't detected
    if date_col == -1: date_col = 0
    if amount_col == -1: amount_col = 1
    if desc_col == -1: desc_col = min(2, len(header) - 1)

    parsed_transactions = []
    for row in rows[header_idx + 1:]:
        if not row or len(row) <= max(date_col, amount_col):
            continue

        try:
            amt_str = row[amount_col].replace(",", "").strip()
            if amt_str.startswith("(") and amt_str.endswith(")"):
                amt_str = "-" + amt_str[1:-1]
            amount = abs(float(amt_str))

            date_str = row[date_col].strip()
            txn_date = None
            for fmt in (
                "%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d-%m-%Y %H:%M:%S",
                "%d-%m-%Y", "%d/%m/%Y %H:%M:%S", "%d/%m/%Y", "%m/%d/%Y",
                "%d-%b-%Y", "%d-%b-%y"
            ):
                try:
                    txn_date = datetime.strptime(date_str, fmt)
                    break
                except ValueError:
                    continue

            if not txn_date:
                txn_date = datetime.now()

            desc = row[desc_col].strip() if desc_col < len(row) else "UPI Transaction"
            txn_type = "credit"
            if type_col != -1 and type_col < len(row):
                t_val = row[type_col].lower()
                if any(w in t_val for w in ["dr", "debit", "payment", "withdrawn", "sent"]):
                    txn_type = "debit"
            elif float(amt_str) < 0:
                txn_type = "debit"

            parsed_transactions.append({
                "profile_id": profile_id,
                "txn_date": txn_date.isoformat(timespec="seconds").replace("+00:00", "Z"),
                "amount": amount,
                "customer_id": desc[:50],
                "txn_type": txn_type
            })
        except Exception:
            continue

    return parsed_transactions



def analyze_upi_credit(profile_id: str = "DEMO-VENDOR", loan_amount: int | None = None) -> dict:
    transactions = _fetch_upi_transactions(profile_id)
    features = extract_upi_features(transactions)
    credit = score_credit(features)
    warnings = detect_anomalies(transactions, features)

    effective_loan = loan_amount or min(credit["max_loan_eligibility"], 50000) or 15000
    repayment = build_flexible_repayment(
        effective_loan,
        features.daily_sales_by_weekday,
    )
    has_critical_warning = any(w["severity"] == "critical" for w in warnings)
    requires_manual_review = has_critical_warning or bool(warnings)
    review_status = "manual_review_required" if requires_manual_review else "ready_for_nbfc_review"
    case_reference = f"UPI-{profile_id}-{datetime.now(timezone.utc):%Y%m%d}"

    return {
        "profile_id": profile_id,
        "features": {
            "daily_throughput": features.daily_throughput,
            "transaction_volume": features.transaction_volume,
            "consistency_score": features.consistency_score,
            "customer_retention": features.customer_retention,
            "avg_monthly_revenue": features.avg_monthly_revenue,
            "transacting_days": features.transacting_days,
            "total_days": features.total_days,
            "total_unique_customers": features.total_unique_customers,
            "repeat_customers": features.repeat_customers,
        },
        "credit_score": credit,
        "anomaly_warnings": warnings,
        "has_critical_warning": has_critical_warning,
        "repayment": repayment,
        "transaction_count": len(transactions),
        "recent_transactions": list(reversed(transactions[-8:])),
        "verification_report": {
            "case_reference": case_reference,
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "report_type": "UPI Cash-Flow Underwriting Report",
            "review_status": review_status,
            "recommended_decision": "refer" if requires_manual_review else "eligible_subject_to_kyc",
            "requested_loan_amount": effective_loan,
            "eligible_limit": credit["max_loan_eligibility"],
            "verification_checks": [
                {"name": "Transaction history", "status": "pass" if features.transacting_days >= 30 else "review", "detail": f"{features.transacting_days} active days out of {features.total_days} days analysed"},
                {"name": "Cash-flow consistency", "status": "pass" if features.consistency_score >= 60 else "review", "detail": f"Consistency score: {features.consistency_score}/100"},
                {"name": "Customer recurrence", "status": "pass" if features.customer_retention >= 30 else "review", "detail": f"{features.repeat_customers} repeat customers identified"},
                {"name": "Transaction anomaly screening", "status": "review" if warnings else "pass", "detail": f"{len(warnings)} alert(s) requiring review" if warnings else "No material anomalies detected"},
            ],
            "next_step": "Obtain customer consent and complete KYC before disbursement." if not requires_manual_review else "Verify flagged transaction source and obtain underwriter approval before disbursement.",
        },
    }


def get_credit_warnings(profile_id: str = "DEMO-VENDOR") -> list[dict]:
    transactions = _fetch_upi_transactions(profile_id)
    features = extract_upi_features(transactions)
    return detect_anomalies(transactions, features)


def get_flexible_repayment_plans(loan_amount: int, profile_id: str = "DEMO-VENDOR") -> dict:
    transactions = _fetch_upi_transactions(profile_id)
    features = extract_upi_features(transactions)
    return build_flexible_repayment(loan_amount, features.daily_sales_by_weekday)
