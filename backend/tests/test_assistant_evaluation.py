"""Unit tests for Step-by-Step AI Assistant Scheme Evaluation Engine."""

import unittest
from services import evaluate_worker_eligibility_report


class AssistantSchemeEvaluationTests(unittest.TestCase):
    def test_evaluates_schemes_strictly_by_income_and_age(self):
        # Case 1: Young worker with income under 15k (eligible for PM-SYM)
        report1 = evaluate_worker_eligibility_report(
            full_name="Ramesh Patel",
            aadhaar_number="123456789012",
            daily_earning=500,
            daily_expense=200,
            monthly_income=13000,
            age=28,
            occupation="Street Vendor in Ahmedabad",
            location="Gujarat",
        )
        self.assertEqual(report1["masked_aadhaar"], "XXXX-XXXX-9012")
        self.assertEqual(report1["net_daily_buffer"], 300)
        self.assertEqual(report1["eligible_loan_tier"], 2)
        self.assertEqual(report1["eligible_loan_amount"], 15000)

        matched_names = [s["scheme_name"] for s in report1["matched_schemes"]]
        self.assertIn("PM SVANidhi Scheme", matched_names)
        self.assertIn("PM-SYM Pension Scheme", matched_names)
        self.assertIn("e-Shram National Worker Card", matched_names)
        self.assertIn("Ayushman Bharat PM-JAY", matched_names)
        self.assertIn("Gujarat Mukhyamantri Amrutum & Shramik Annapurna", matched_names)

    def test_rejects_pmsym_if_age_or_income_exceeds_limits(self):
        # Case 2: Worker aged 45 with income 28k (Ineligible for PM-SYM due to age > 40 & income > 15k)
        report2 = evaluate_worker_eligibility_report(
            full_name="Suresh Bhai",
            aadhaar_number="987654321098",
            daily_earning=1200,
            daily_expense=400,
            monthly_income=31200,
            age=45,
            occupation="Delivery Partner",
            location="Delhi",
        )
        matched_names = [s["scheme_name"] for s in report2["matched_schemes"]]
        ineligible_names = [s["scheme_name"] for s in report2["ineligible_schemes"]]

        # PM-SYM must NOT be in matched_schemes, must be in ineligible_schemes
        self.assertNotIn("PM-SYM Pension Scheme", matched_names)
        self.assertIn("PM-SYM Pension Scheme", ineligible_names)

        # Ayushman Bharat must be in ineligible_schemes (income > 25k)
        self.assertIn("Ayushman Bharat PM-JAY", ineligible_names)


if __name__ == "__main__":
    unittest.main()
