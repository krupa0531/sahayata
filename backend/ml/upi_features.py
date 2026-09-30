"""Feature engineering from UPI transaction logs."""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime


@dataclass
class UpiFeatures:
    daily_throughput: float
    transaction_volume: float
    consistency_score: float
    customer_retention: float
    avg_monthly_revenue: float
    transacting_days: int
    total_days: int
    total_unique_customers: int
    repeat_customers: int
    daily_sales_by_weekday: dict[str, float]


def _parse_date(value: str) -> datetime:
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%SZ"):
        try:
            return datetime.strptime(value.replace("+00:00", "Z"), fmt)
        except ValueError:
            continue
    raise ValueError(f"Unsupported date format: {value}")


def extract_upi_features(transactions: list[dict]) -> UpiFeatures:
    """
    Build ML-ready indicators from raw UPI credit transactions.

    Expected keys per row: txn_date, amount, customer_id, txn_type (optional, default credit).
    """
    credits = [
        row
        for row in transactions
        if float(row.get("amount", 0)) > 0
        and str(row.get("txn_type", "credit")).lower() in {"credit", "inflow", "received"}
    ]

    if not credits:
        return UpiFeatures(
            daily_throughput=0.0,
            transaction_volume=0.0,
            consistency_score=0.0,
            customer_retention=0.0,
            avg_monthly_revenue=0.0,
            transacting_days=0,
            total_days=0,
            total_unique_customers=0,
            repeat_customers=0,
            daily_sales_by_weekday={},
        )

    daily_amounts: dict[str, float] = defaultdict(float)
    daily_customers: dict[str, set[str]] = defaultdict(set)
    customer_counts: dict[str, int] = defaultdict(int)
    weekday_amounts: dict[str, list[float]] = defaultdict(list)

    for row in credits:
        dt = _parse_date(str(row["txn_date"]))
        day_key = dt.strftime("%Y-%m-%d")
        amount = float(row["amount"])
        customer = str(row["customer_id"])

        daily_amounts[day_key] += amount
        daily_customers[day_key].add(customer)
        customer_counts[customer] += 1
        weekday_amounts[dt.strftime("%a")].append(amount)

    sorted_days = sorted(daily_amounts.keys())
    start = _parse_date(sorted_days[0])
    end = _parse_date(sorted_days[-1])
    total_days = max((end - start).days + 1, 1)
    transacting_days = len(daily_amounts)

    daily_throughput = sum(daily_amounts.values()) / transacting_days
    transaction_volume = sum(len(customers) for customers in daily_customers.values()) / transacting_days
    consistency_score = round((transacting_days / total_days) * 100, 1)

    total_unique = len(customer_counts)
    repeat_customers = sum(1 for count in customer_counts.values() if count > 1)
    customer_retention = round((repeat_customers / total_unique) * 100, 1) if total_unique else 0.0

    period_months = max(total_days / 30, 1)
    avg_monthly_revenue = round(sum(daily_amounts.values()) / period_months, 2)

    daily_sales_by_weekday = {
        day: round(sum(amounts) / len(amounts), 2)
        for day, amounts in weekday_amounts.items()
    }

    return UpiFeatures(
        daily_throughput=round(daily_throughput, 2),
        transaction_volume=round(transaction_volume, 2),
        consistency_score=consistency_score,
        customer_retention=customer_retention,
        avg_monthly_revenue=avg_monthly_revenue,
        transacting_days=transacting_days,
        total_days=total_days,
        total_unique_customers=total_unique,
        repeat_customers=repeat_customers,
        daily_sales_by_weekday=daily_sales_by_weekday,
    )
