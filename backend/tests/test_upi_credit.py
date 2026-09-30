"""Unit tests for UPI credit scoring pipeline."""

import unittest

from ml.anomaly_detector import detect_anomalies
from ml.credit_scorer import score_credit
from ml.flexible_repayment import build_flexible_repayment
from ml.upi_features import extract_upi_features


SAMPLE_TXNS = [
    {"txn_date": "2026-04-01", "amount": 500, "customer_id": "C1", "txn_type": "credit"},
    {"txn_date": "2026-04-01", "amount": 600, "customer_id": "C2", "txn_type": "credit"},
    {"txn_date": "2026-04-02", "amount": 550, "customer_id": "C1", "txn_type": "credit"},
    {"txn_date": "2026-04-03", "amount": 480, "customer_id": "C3", "txn_type": "credit"},
    {"txn_date": "2026-04-04", "amount": 520, "customer_id": "C2", "txn_type": "credit"},
    {"txn_date": "2026-04-05", "amount": 200000, "customer_id": "C99", "txn_type": "credit"},
]


class UpiCreditPipelineTests(unittest.TestCase):
    def test_feature_engineering(self):
        features = extract_upi_features(SAMPLE_TXNS)
        self.assertGreater(features.daily_throughput, 0)
        self.assertGreaterEqual(features.consistency_score, 0)
        self.assertGreaterEqual(features.customer_retention, 0)

    def test_credit_scoring_returns_risk(self):
        features = extract_upi_features(SAMPLE_TXNS)
        result = score_credit(features)
        self.assertIn(result["risk_level"], {"low", "medium", "high", "reject"})
        self.assertIn("max_loan_eligibility", result)

    def test_anomaly_detection_flags_spike(self):
        features = extract_upi_features(SAMPLE_TXNS)
        warnings = detect_anomalies(SAMPLE_TXNS, features)
        self.assertTrue(any(w["amount"] >= 200000 for w in warnings))

    def test_flexible_repayment_has_weekday_schedule(self):
        features = extract_upi_features(SAMPLE_TXNS)
        plans = build_flexible_repayment(15000, features.daily_sales_by_weekday)
        self.assertIn("daily_flexible", plans)
        self.assertEqual(len(plans["daily_flexible"]["weekday_schedule"]), 7)


if __name__ == "__main__":
    unittest.main()
