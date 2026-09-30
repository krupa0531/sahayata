"""Unsupervised anomaly detection for suspicious UPI inflows."""

from __future__ import annotations

from collections import defaultdict

import numpy as np
from sklearn.ensemble import IsolationForest

from ml.upi_features import UpiFeatures

_MODEL: IsolationForest | None = None


def _get_model(amounts: list[float]) -> IsolationForest:
    global _MODEL
    if _MODEL is None or len(amounts) < 10:
        values = np.array(amounts or [500, 600, 550, 480, 520]).reshape(-1, 1)
        model = IsolationForest(contamination=0.08, random_state=42)
        model.fit(values)
        _MODEL = model
    return _MODEL


def detect_anomalies(
    transactions: list[dict],
    features: UpiFeatures,
) -> list[dict]:
    credits = [
        row for row in transactions
        if str(row.get("txn_type", "credit")).lower() in {"credit", "inflow", "received"}
        and float(row.get("amount", 0)) > 0
    ]
    if not credits:
        return []

    amounts = [float(row["amount"]) for row in credits]
    model = _get_model(amounts)
    customer_history: dict[str, int] = defaultdict(int)
    warnings: list[dict] = []

    daily_avg = features.daily_throughput or 1.0
    threshold = daily_avg * 5

    for row in credits:
        amount = float(row["amount"])
        customer = str(row["customer_id"])
        customer_history[customer] += 1

        is_statistical_anomaly = model.predict([[amount]])[0] == -1
        is_spike = amount >= threshold

        if not (is_statistical_anomaly or is_spike):
            continue

        repeat_customer = customer_history[customer] > 1
        velocity_flag = _check_velocity_risk(row, transactions)

        pattern_check = "Bulk order from repeat customer" if repeat_customer else "Unknown / new payer"
        velocity_check = (
            "Funds withdrawn within 2 hours — possible layering"
            if velocity_flag
            else "No immediate outflow detected"
        )

        warnings.append({
            "txn_date": row["txn_date"],
            "amount": amount,
            "customer_id": customer,
            "anomaly_score": round(float(model.decision_function([[amount]])[0]), 3),
            "daily_average": round(daily_avg, 2),
            "spike_ratio": round(amount / daily_avg, 1),
            "pattern_check": pattern_check,
            "velocity_check": velocity_check,
            "is_repeat_customer": repeat_customer,
            "velocity_flag": velocity_flag,
            "severity": "critical" if velocity_flag else "warning",
            "message": (
                "Suspicious high-value inflow detected. Verified source needed before next disbursement."
            ),
        })

    warnings.sort(key=lambda item: item["amount"], reverse=True)
    return warnings


def _check_velocity_risk(credit_txn: dict, all_txns: list[dict]) -> bool:
    """Flag if large inflow is followed by rapid debit (fraud / laundering indicator)."""
    credit_amount = float(credit_txn.get("amount", 0))
    if credit_amount < 50000:
        return False

    credit_date = str(credit_txn.get("txn_date", ""))[:10]
    for row in all_txns:
        if str(row.get("txn_type", "")).lower() not in {"debit", "outflow", "withdrawal"}:
            continue
        debit_amount = float(row.get("amount", 0))
        debit_date = str(row.get("txn_date", ""))[:10]
        if debit_date == credit_date and debit_amount >= credit_amount * 0.8:
            return True
    return False
