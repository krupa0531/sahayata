"""Supervised credit scoring — Random Forest risk classification."""

from __future__ import annotations

import numpy as np
from sklearn.ensemble import RandomForestClassifier

from ml.upi_features import UpiFeatures

RISK_MULTIPLIERS = {
    "low": 2.0,
    "medium": 1.0,
    "high": 0.5,
    "reject": 0.0,
}

_MODEL: RandomForestClassifier | None = None


def _build_training_data() -> tuple[np.ndarray, np.ndarray]:
    """Synthetic labelled vendor profiles for demo / cold-start training."""
    samples = [
        # daily_throughput, txn_volume, consistency, retention, monthly_revenue -> label
        (8500, 45, 92, 68, 255000, "low"),
        (6200, 38, 88, 55, 186000, "low"),
        (4100, 28, 75, 42, 123000, "medium"),
        (2800, 18, 62, 35, 84000, "medium"),
        (1200, 10, 45, 22, 36000, "high"),
        (650, 6, 30, 15, 19500, "high"),
        (320, 3, 18, 8, 9600, "reject"),
        (9500, 52, 95, 72, 285000, "low"),
        (5200, 32, 80, 48, 156000, "medium"),
        (1800, 12, 50, 28, 54000, "high"),
    ]
    x = np.array([row[:5] for row in samples], dtype=float)
    y = np.array([row[5] for row in samples])
    return x, y


def _get_model() -> RandomForestClassifier:
    global _MODEL
    if _MODEL is None:
        x, y = _build_training_data()
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(x, y)
        _MODEL = model
    return _MODEL


def _features_to_vector(features: UpiFeatures) -> np.ndarray:
    return np.array([[
        features.daily_throughput,
        features.transaction_volume,
        features.consistency_score,
        features.customer_retention,
        features.avg_monthly_revenue,
    ]])


def score_credit(features: UpiFeatures) -> dict:
    model = _get_model()
    vector = _features_to_vector(features)
    risk_level: str = model.predict(vector)[0]
    probabilities = dict(zip(model.classes_, model.predict_proba(vector)[0].tolist()))

    multiplier = RISK_MULTIPLIERS[risk_level]
    max_loan = round(features.avg_monthly_revenue * multiplier) if multiplier > 0 else 0

    if risk_level == "low":
        recommendation = "Consistent cash flow. Eligible for PM SVANidhi top-up with daily repayment."
    elif risk_level == "medium":
        recommendation = "Moderate stability. Start with a smaller working-capital loan."
    elif risk_level == "high":
        recommendation = "High fluctuation detected. Reduced loan limit with stricter monitoring."
    else:
        recommendation = "Insufficient UPI history. Build 30+ active transacting days before applying."

    return {
        "risk_level": risk_level,
        "risk_probabilities": {k: round(v, 3) for k, v in probabilities.items()},
        "risk_multiplier": multiplier,
        "max_loan_eligibility": max_loan,
        "avg_monthly_revenue": features.avg_monthly_revenue,
        "recommendation": recommendation,
        "model": "RandomForestClassifier",
    }
