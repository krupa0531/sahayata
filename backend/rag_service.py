"""Source-cited retrieval for policy guidance.

This module deliberately keeps retrieval separate from credit, KYC and loan
decisioning. It can work without an AI provider; an optional provider is used
only to summarise already retrieved, approved content.
"""

from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from config import RAG_OPENAI_API_KEY, RAG_OPENAI_MODEL
from database import get_connection


SEED_SOURCES = [
    {
        "id": "RBI-DIGITAL-LENDING-2025",
        "title": "RBI Digital Lending Directions, 2025 — borrower transparency",
        "source_type": "rbi",
        "official_url": "https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436",
        "effective_from": "2025-05-08",
        "language": "en",
        "content": "Digital lending guidance requires a customer-centric presentation of loan offers. When an LSP works with more than one regulated entity, the borrower should be able to see the regulated entity name, loan amount, APR, tenor and material terms. Interfaces must not use dark patterns to steer a borrower toward an unsuitable offer. Sahayata must show the actual lending partner and verified loan terms before a user proceeds. This app is not itself a regulated lender unless an RBI-regulated partner is explicitly identified.",
    },
    {
        "id": "RBI-KYC-2025",
        "title": "RBI KYC Amendment Directions, 2025",
        "source_type": "rbi",
        "official_url": "https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=12866",
        "effective_from": "2025-06-12",
        "language": "en",
        "content": "KYC must be handled by the regulated entity under its KYC policy and applicable law. Sahayata can collect documents only with clear user consent and must not promise that an upload means KYC approval. Never request an OTP, PIN, UPI PIN, CVV or password in chat. KYC documents and personal data must stay outside the shared policy knowledge base and must never be exposed in answers to another user.",
    },
    {
        "id": "RBI-FAIR-PRACTICES",
        "title": "RBI Fair Practices Code for Lenders",
        "source_type": "rbi",
        "official_url": "https://www.rbi.org.in/CommonPerson/english/scripts/Notification.aspx?Id=141",
        "effective_from": "2003-08-01",
        "language": "en",
        "content": "Lenders should assess loan applications fairly, disclose material terms and communicate decisions in a timely manner. For small borrowers, lenders should communicate the main reasons for rejection in writing where applicable. Recovery must not involve harassment, persistent calls at odd hours or coercion. The assistant must not claim that a user is approved, rejected or guaranteed a loan; it can explain the documented application status and direct the user to the lender or grievance channel.",
    },
    {
        "id": "RBI-KFS-LOANS",
        "title": "RBI Key Facts Statement (KFS) for Loans and Advances",
        "source_type": "rbi",
        "official_url": "https://systemhealth.rbi.org.in/Scripts/BS_ViewMasDirections.aspx_id%3D12256%282%29.html",
        "effective_from": "2024-04-15",
        "language": "en",
        "content": "A Key Facts Statement helps a borrower make an informed decision using simple, standardised loan information. APR is the annual cost of credit and includes interest and applicable charges. Before accepting a verified partner loan, users should receive the lender name, sanctioned amount, APR, repayment schedule or tenure, all charges and terms. If a partner KFS is not present in the approved knowledge base, the assistant must say that exact pricing is unavailable rather than inventing it.",
    },
    {
        "id": "GOV-MYSCHEME-DISCOVERY",
        "title": "myScheme — official Government scheme discovery",
        "source_type": "government_scheme",
        "official_url": "https://www.myscheme.gov.in/",
        "effective_from": None,
        "language": "en",
        "content": "myScheme is the Government of India platform for finding schemes using details such as demographic information, income and category. Scheme pages provide eligibility, benefits, required documents, FAQs and official application links. Sahayata may help users discover relevant schemes such as PM SVANidhi, PM Mudra, e-Shram and PM-SYM, but it must link to the official scheme page and must not guarantee eligibility, approval or benefit amounts. Scheme information must be reviewed before publication because criteria and application windows change.",
    },
    {
        "id": "APP-ELIGIBILITY-GUIDANCE",
        "title": "Sahayata app eligibility guidance",
        "source_type": "app_policy",
        "official_url": "https://sahayata.local/policy/eligibility",
        "effective_from": "2026-07-23",
        "language": "en",
        "content": "Sahayata's displayed eligibility tier is an educational estimate based on the daily earning and expense values entered in the app. The UPI analysis is a separate risk-support feature and may flag inconsistent or suspicious transaction patterns. Neither result is a loan sanction, a credit bureau score, a lender decision or a promise of disbursal. A regulated lender or authorised partner makes the final decision after its required checks. Users should review the lender's Key Facts Statement before accepting any offer.",
    },
    {
        "id": "APP-SAFETY-PRIVACY",
        "title": "Sahayata safety, privacy and escalation policy",
        "source_type": "app_policy",
        "official_url": "https://sahayata.local/policy/safety",
        "effective_from": "2026-07-23",
        "language": "en",
        "content": "Sahayata never asks for OTPs, UPI PINs, CVVs, bank passwords or card PINs. Do not share those details in chat. The assistant provides general information from approved policy sources and cannot provide legal, investment or personalised credit advice. For a dispute, suspected fraud or a decision concern, use the verified lender or application support channel. Uploaded KYC and bank documents are not added to the public RAG index.",
    },
    {
        "id": "GOV-PM-SVANIDHI",
        "title": "PM SVANidhi — Street Vendor Special Micro-Credit Scheme",
        "source_type": "government_scheme",
        "official_url": "https://pmsvanidhi.mohua.gov.in/",
        "effective_from": "2020-06-01",
        "language": "en",
        "content": "PM SVANidhi provides collateral-free working capital micro-loans up to ₹10,000 in first tranche, ₹20,000 in second tranche, and ₹50,000 in third tranche for street vendors, delivery partners, and small informal traders. Offers 7% interest subsidy per annum directly credited to bank account for timely repayments, along with cash-back incentives up to ₹1,200/year for digital transaction adoption.",
    },
    {
        "id": "GOV-PM-JAN-DHAN",
        "title": "PM Jan Dhan Yojana (PMJDY)",
        "source_type": "government_scheme",
        "official_url": "https://pmjdy.gov.in/",
        "effective_from": "2014-08-28",
        "language": "en",
        "content": "PM Jan Dhan Yojana provides basic savings bank account (BSBD) with zero minimum balance requirement, free RuPay debit card, ₹2 Lakh accidental insurance cover, ₹30,000 life cover, and overdraft facility up to ₹10,000 after 6 months of satisfactory operation for unorganised workers.",
    },
    {
        "id": "GOV-AYUSHMAN-BHARAT",
        "title": "Ayushman Bharat PM-JAY Health Protection",
        "source_type": "government_scheme",
        "official_url": "https://pmjay.gov.in/",
        "effective_from": "2018-09-23",
        "language": "en",
        "content": "Ayushman Bharat PM-JAY provides cashless secondary and tertiary hospitalisation health cover up to ₹5 Lakh per family per year for low-income informal and gig workers across empanelled public and private hospitals nationwide.",
    },
    {
        "id": "GOV-E-SHRAM",
        "title": "e-Shram Portal & National Unorganised Workers Database",
        "source_type": "government_scheme",
        "official_url": "https://eshram.gov.in/",
        "effective_from": "2021-08-26",
        "language": "en",
        "content": "e-Shram provides a 12-digit Universal Account Number (UAN) for all unorganised and gig workers, direct linkage to social security schemes, ₹2 Lakh accidental death cover, ₹1 Lakh disability cover, and direct benefit transfer (DBT) during emergency worker relief programs.",
    },
    {
        "id": "GOV-PM-JEEVAN-JYOTI",
        "title": "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
        "source_type": "government_scheme",
        "official_url": "https://www.jansuraksha.gov.in/",
        "effective_from": "2015-05-09",
        "language": "en",
        "content": "PMJJBY offers ₹2 Lakh life insurance cover for any cause of death at a nominal premium of ₹436/year auto-debited from bank account for individuals aged 18 to 50 years.",
    },
    {
        "id": "GOV-PM-SURAKSHA-BIMA",
        "title": "PM Suraksha Bima Yojana (PMSBY)",
        "source_type": "government_scheme",
        "official_url": "https://www.jansuraksha.gov.in/",
        "effective_from": "2015-05-09",
        "language": "en",
        "content": "PMSBY provides ₹2 Lakh coverage for accidental death or full disability and ₹1 Lakh for partial disability at an ultra-low premium of ₹20/year for adults aged 18 to 70 years.",
    },
    {
        "id": "GUJ-MA-AMRUTAM",
        "title": "Mukhyamantri Amrutum (MA) & Gujarat Health Scheme",
        "source_type": "government_scheme",
        "official_url": "https://gujaratindia.gov.in/",
        "effective_from": "2012-09-04",
        "language": "en",
        "content": "Gujarat state Mukhyamantri Amrutum scheme provides cashless medical treatment up to ₹5 Lakh per year for BPL families, daily wage labourers, street vendors, and gig workers residing in Gujarat for critical illnesses and surgeries.",
    },
    {
        "id": "GUJ-SHRAMIK-ANNAPURNA",
        "title": "Shramik Annapurna Yojana Gujarat",
        "source_type": "government_scheme",
        "official_url": "https://bocw.gujarat.gov.in/",
        "effective_from": "2017-07-18",
        "language": "en",
        "content": "Gujarat Labour Welfare Board scheme providing hot nutritious meal at just ₹5 at construction sites, labour hubs (Kadia Naka), and gig worker assembly areas across Gujarat for registered workers.",
    }
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def _tokens(value: str) -> list[str]:
    return re.findall(r"[a-z0-9]{2,}", value.lower())


def _chunks(content: str, words_per_chunk: int = 110) -> list[str]:
    words = content.split()
    return [" ".join(words[index:index + words_per_chunk]) for index in range(0, len(words), words_per_chunk)]


def upsert_source(source: dict) -> None:
    content = source["content"].strip()
    now = _now()
    content_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()
    with get_connection() as conn:
        conn.execute(
            """INSERT INTO rag_sources (id, title, source_type, official_url, effective_from, last_reviewed, language, status, content_sha256, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET title=excluded.title, source_type=excluded.source_type,
               official_url=excluded.official_url, effective_from=excluded.effective_from,
               last_reviewed=excluded.last_reviewed, language=excluded.language, status='active',
               content_sha256=excluded.content_sha256, updated_at=excluded.updated_at""",
            (source["id"], source["title"], source["source_type"], source["official_url"], source.get("effective_from"), now[:10], source.get("language", "en"), content_hash, now, now),
        )
        conn.execute("DELETE FROM rag_chunks WHERE source_id = ?", (source["id"],))
        conn.executemany(
            "INSERT INTO rag_chunks (source_id, chunk_index, content, token_count) VALUES (?, ?, ?, ?)",
            [(source["id"], index, chunk, len(_tokens(chunk))) for index, chunk in enumerate(_chunks(content))],
        )


def seed_knowledge_base() -> None:
    with get_connection() as conn:
        existing = {row[0] for row in conn.execute("SELECT id FROM rag_sources").fetchall()}
    for source in SEED_SOURCES:
        if source["id"] not in existing:
            upsert_source(source)


def _score(question: str, content: str) -> int:
    query_terms = set(_tokens(question))
    content_terms = _tokens(content)
    if not query_terms:
        return 0
    return sum(content_terms.count(term) for term in query_terms) + 3 * sum(term in content.lower() for term in query_terms if len(term) > 5)


def retrieve(question: str, limit: int = 4) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            """SELECT c.content, s.id AS source_id, s.title, s.source_type, s.official_url,
                      s.effective_from, s.last_reviewed
               FROM rag_chunks c JOIN rag_sources s ON s.id = c.source_id
               WHERE s.status = 'active'"""
        ).fetchall()
    results = [{**dict(row), "score": _score(question, row["content"])} for row in rows]
    return [result for result in sorted(results, key=lambda item: item["score"], reverse=True) if result["score"] > 0][:limit]


def _fallback_answer(matches: list[dict], language: str) -> str:
    lang = language if language in ("hi", "gu", "en") else "en"
    if not matches:
        return {
            "hi": "इस प्रश्न के लिए स्वीकृत ज्ञानकोष में सत्यापित जानकारी नहीं मिली। सटीक ऋण व योजना शर्तों के लिए कृपया ऋणदाता या आधिकारिक योजना पोर्टल देखें।",
            "gu": "આ પ્રશ્ન માટે મંજૂર થયેલ ડેટાબેઝમાં ચકાસાયેલ માહિતી મળી નથી. ચોક્કસ લોન અને યોજના શરતો માટે ધિરાણકર્તા અથવા સત્તાવાર પોર્ટલ જુઓ.",
            "en": "No verified information was found in the approved knowledge base. Check the lender or official scheme page for exact terms.",
        }[lang]
    prefix = {
        "hi": "स्वीकृत आधिकारिक स्रोतों के अनुसार: ",
        "gu": "મંજૂર સત્તાવાર સ્ત્રોતો મુજબ: ",
        "en": "According to the approved sources: ",
    }[lang]
    return prefix + " ".join(item["content"] for item in matches[:2])


def _openai_answer(question: str, matches: list[dict], language: str) -> str | None:
    if not RAG_OPENAI_API_KEY or not matches:
        return None
    context = "\n\n".join(f"[{index + 1}] {item['content']}" for index, item in enumerate(matches))
    prompt = (
        "Answer only from the supplied approved policy excerpts. Do not make eligibility, approval, legal, investment or credit decisions. "
        "If the excerpts do not answer the question, say so. Do not mention citations in the answer; citations are added by the API. "
        f"Reply in {language}.\n\nQuestion: {question}\n\nApproved excerpts:\n{context}"
    )
    body = json.dumps({"model": RAG_OPENAI_MODEL, "messages": [{"role": "user", "content": prompt}], "temperature": 0.1}).encode("utf-8")
    request = Request("https://api.openai.com/v1/chat/completions", data=body, headers={"Authorization": f"Bearer {RAG_OPENAI_API_KEY}", "Content-Type": "application/json"})
    try:
        with urlopen(request, timeout=12) as response:
            return json.loads(response.read().decode("utf-8"))["choices"][0]["message"]["content"].strip()
    except (HTTPError, URLError, KeyError, IndexError, json.JSONDecodeError):
        return None


def answer(question: str, language: str) -> dict:
    matches = retrieve(question)
    generated = _openai_answer(question, matches, language)
    citations = [
        {key: item[key] for key in ("source_id", "title", "source_type", "official_url", "effective_from", "last_reviewed")}
        | {"excerpt": item["content"][:360]}
        for item in matches
    ]
    return {
        "answer": generated or _fallback_answer(matches, language),
        "citations": citations,
        "disclaimer": "General guidance from approved sources only. It is not a loan approval, financial advice or a substitute for the lender's Key Facts Statement.",
        "needs_human_review": not bool(matches),
    }

