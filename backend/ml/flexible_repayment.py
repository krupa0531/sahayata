"""Flexible repayment — adjust daily deduction by sales pattern."""

from __future__ import annotations

WEEKDAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def build_flexible_repayment(
    loan_amount: int,
    daily_sales_by_weekday: dict[str, float],
    *,
    base_daily_pct: float = 0.10,
    monthly_profit_pct: float = 0.28,
) -> dict:
    avg_daily_sales = (
        sum(daily_sales_by_weekday.values()) / len(daily_sales_by_weekday)
        if daily_sales_by_weekday
        else 5000
    )

    weekday_schedule = []
    for day in WEEKDAY_ORDER:
        sales = daily_sales_by_weekday.get(day, avg_daily_sales)
        ratio = sales / avg_daily_sales if avg_daily_sales else 1.0
        adjusted_pct = round(min(max(base_daily_pct * ratio, 0.05), 0.18), 3)
        deduction = max(round(sales * adjusted_pct), 50)
        weekday_schedule.append({
            "day": day,
            "expected_sales": round(sales),
            "deduction_pct": round(adjusted_pct * 100, 1),
            "deduction_amount": deduction,
            "note": _day_note(ratio),
        })

    fixed_daily = max(round(loan_amount / 300), 50)
    pct_daily = max(round(avg_daily_sales * base_daily_pct), 50)
    monthly_emi = max(round(loan_amount / 30), 500)

    return {
        "loan_amount": loan_amount,
        "daily_fixed": {
            "mode": "daily_fixed",
            "amount": f"INR {fixed_daily:,}",
            "desc": "Fixed EDI — eNACH / UPI Autopay mandate (roz subah auto-debit)",
            "deduction_rule": f"INR {fixed_daily}/day fixed",
            "retry_policy": "Balance na hone par 3 retries (6 AM, 12 PM, 6 PM)",
        },
        "daily_flexible": {
            "mode": "daily_flexible",
            "amount": f"INR {pct_daily:,}",
            "desc": "Flexible EDI — daily collection ka variable % (weekend zyada, slow days kam)",
            "deduction_rule": f"{round(base_daily_pct * 100)}% of daily UPI collection (ML-adjusted by weekday)",
            "weekday_schedule": weekday_schedule,
            "retry_policy": "Low-balance days par next high-sales day par catch-up deduction",
        },
        "monthly": {
            "mode": "monthly",
            "amount": f"INR {monthly_emi:,}",
            "desc": "Monthly EMI — fixed date par auto-debit (1st of month)",
            "deduction_rule": f"Monthly profit ka max {round(monthly_profit_pct * 100)}%",
            "bounce_penalty": "Bounce hone par INR 350 penalty + credit score impact",
            "retry_policy": "3 retry attempts over 5 days, then NBFC escalation",
        },
        "recommended_mode": "daily_flexible",
        "smart_tip": (
            "ML model ne detect kiya ki weekends par zyada sale hoti hai — "
            "us din deduction thodi badhai jayegi, Tuesdays jaise slow days par kam."
        ),
    }


def _day_note(ratio: float) -> str:
    if ratio >= 1.15:
        return "High sales day — deduction thodi zyada"
    if ratio <= 0.85:
        return "Slow day — deduction kam"
    return "Normal deduction"
