import re
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator


class EligibilityRequest(BaseModel):
    daily_earning: int = Field(ge=200, le=3000)
    daily_expense: int = Field(ge=0, le=3000)


class EligibilityResponse(BaseModel):
    daily_earning: int
    daily_expense: int
    net_daily_buffer: int
    eligible_amount: int
    tier: int
    label: str
    css_class: str
    recommendation: str


class UserRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    mobile: str = Field(min_length=10, max_length=15, pattern=r"^[0-9+\-\s]+$")
    email: str | None = Field(default=None, max_length=120)
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    mobile: str = Field(min_length=10, max_length=15)
    password: str = Field(min_length=6, max_length=128)


class OtpRequest(BaseModel):
    mobile: str = Field(min_length=10, max_length=16, pattern=r"^[0-9+\-\s]+$")
    sms_consent: Literal[True] = Field(
        description="Confirms the user wants to receive a verification SMS."
    )


class OtpVerify(BaseModel):
    mobile: str = Field(min_length=10, max_length=16, pattern=r"^[0-9+\-\s]+$")
    code: str = Field(min_length=4, max_length=10, pattern=r"^[0-9]+$")


class OtpVerificationResponse(BaseModel):
    verified: bool
    message: str


class UserResponse(BaseModel):
    id: str
    full_name: str
    mobile: str
    email: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ApplicationCreate(BaseModel):
    full_name: str = Field(default="Beneficiary Worker", max_length=120)
    identity_number: str = Field(default="", max_length=64)
    occupation_type: str = Field(default="Unorganised Worker", max_length=80)
    earning_mode: str = Field(default="UPI / digital payments", max_length=80)
    account_number: str = Field(default="", max_length=64)
    upi_id: str = Field(default="", max_length=80)
    requested_amount: Any = Field(default=15000)

    @field_validator("requested_amount", mode="before")
    @classmethod
    def parse_requested_amount(cls, v: Any) -> int:
        if v is None:
            return 15000
        if isinstance(v, (int, float)):
            val = int(v)
            return val if val >= 1000 else 15000
        if isinstance(v, str):
            digits = re.sub(r"[^\d]", "", v)
            if digits:
                val = int(digits)
                return val if val >= 1000 else 15000
        return 15000


class ApplicationResponse(BaseModel):
    id: str
    status: str
    current_stage: str
    message: str


class StatusEvent(BaseModel):
    label: str
    date: str
    state: str


class ApplicationStatus(BaseModel):
    id: str
    applicant_name: str
    requested_amount: int
    status: str
    current_stage: str
    review_note: str | None = None
    timeline: list[StatusEvent]


class ApplicationSummary(BaseModel):
    id: str
    applicant_name: str
    requested_amount: int
    status: str
    current_stage: str
    created_at: str


class RepaymentPlan(BaseModel):
    mode: str
    amount: str
    desc: str
    fill: str
    note: str


class PensionCard(BaseModel):
    lbl: str
    val: str
    cls: str
    sub: str
    unit: str


class SocialSecuritySummary(BaseModel):
    status: Literal["not_linked", "linked"]
    message: str
    pension_cards: list[PensionCard]
    overdraft_used: int
    overdraft_limit: int
    overdraft_available: int
    overdraft_used_percent: int


class WeeklyTransaction(BaseModel):
    day: str
    volume: int
    sales: int


class TrackerStats(BaseModel):
    avg_daily_sales: int
    consistency_score: int
    txns_today: int


class DashboardStat(BaseModel):
    target: str
    suffix: str
    label: str


class DashboardResponse(BaseModel):
    stats: list[DashboardStat]
    ticker: list[str]


class SchemeItem(BaseModel):
    name: str
    sub: str
    desc: str
    tag: str


class MessageResponse(BaseModel):
    message: str


class RagQuery(BaseModel):
    question: str = Field(min_length=3, max_length=800)
    language: Literal["en", "hi", "gu"] = "hi"


class RagCitation(BaseModel):
    source_id: str
    title: str
    source_type: Literal["rbi", "government_scheme", "lender_policy", "app_policy"]
    official_url: str
    effective_from: str | None = None
    last_reviewed: str
    excerpt: str


class RagQueryResponse(BaseModel):
    answer: str
    citations: list[RagCitation]
    disclaimer: str
    needs_human_review: bool = False


class RagSourceCreate(BaseModel):
    id: str = Field(pattern=r"^[A-Z0-9][A-Z0-9_-]{2,63}$")
    title: str = Field(min_length=3, max_length=240)
    source_type: Literal["rbi", "government_scheme", "lender_policy", "app_policy"]
    official_url: str = Field(min_length=8, max_length=2000)
    effective_from: str | None = Field(default=None, max_length=32)
    language: Literal["en", "hi", "gu"] = "en"
    content: str = Field(min_length=80, max_length=50000)


class KycDocumentResponse(BaseModel):
    id: str
    document_type: str
    status: str
    file_name: str
    content_type: str
    size_bytes: int
    submitted_at: str
    rejection_reason: str | None = None


class VoiceAssistantResponse(BaseModel):
    """Text and browser speech settings for the loan-help voice assistant."""

    language: Literal["en", "hi", "gu"]
    locale: str
    text: str
    suggested_actions: list[str]
    security_notice: str


class TextToSpeechRequest(BaseModel):
    """Text from an on-screen speaker button to render in the selected locale."""

    text: str = Field(min_length=1, max_length=5000)
    language: str = "hi"


class ChecklistItem(BaseModel):
    check: bool
    text: str


class ProblemItem(BaseModel):
    icon: str
    title: str
    desc: str


class SolutionItem(BaseModel):
    num: str
    title: str
    desc: str


class RoadmapItem(BaseModel):
    phase: str
    title: str
    items: list[str]


class HeroContent(BaseModel):
    badge: str
    title: str
    title_highlight: str
    description: str
    trust_items: list[str]
    chip_left_title: str
    chip_left_sub: str
    chip_right_title: str
    chip_right_sub: str
    card_kicker: str
    card_title: str


class AboutValue(BaseModel):
    title: str
    desc: str


class AboutTimeline(BaseModel):
    year: str
    event: str


class AboutContent(BaseModel):
    title: str
    subtitle: str
    mission: str
    vision: str
    values: list[AboutValue]
    timeline: list[AboutTimeline]


class HelpStep(BaseModel):
    step: str
    title: str
    desc: str


class HelpFaq(BaseModel):
    q: str
    a: str


class HelpContent(BaseModel):
    title: str
    subtitle: str
    helpline: str
    email: str
    hours: str
    steps: list[HelpStep]
    faqs: list[HelpFaq]


class HomeContent(BaseModel):
    hero: HeroContent
    eligibility_checklist: list[ChecklistItem]
    problems: list[ProblemItem]
    solutions: list[SolutionItem]
    roadmap: list[RoadmapItem]
    credit_flow: list[list[str]]


class FooterLink(BaseModel):
    label: str
    section: str


class FooterContent(BaseModel):
    copyright: str
    links: list[FooterLink]


class UserLocationUpdate(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    area: str | None = Field(default=None, max_length=120)


class UpiFeaturesResponse(BaseModel):
    daily_throughput: float
    transaction_volume: float
    consistency_score: float
    customer_retention: float
    avg_monthly_revenue: float
    transacting_days: int
    total_days: int
    total_unique_customers: int
    repeat_customers: int


class CreditScoreResponse(BaseModel):
    risk_level: str
    risk_probabilities: dict[str, float]
    risk_multiplier: float
    max_loan_eligibility: int
    avg_monthly_revenue: float
    recommendation: str
    model: str


class AnomalyWarning(BaseModel):
    txn_date: str
    amount: float
    customer_id: str
    anomaly_score: float
    daily_average: float
    spike_ratio: float
    pattern_check: str
    velocity_check: str
    is_repeat_customer: bool
    velocity_flag: bool
    severity: str
    message: str


class WeekdayDeduction(BaseModel):
    day: str
    expected_sales: int
    deduction_pct: float
    deduction_amount: int
    note: str


class RepaymentModeDetail(BaseModel):
    mode: str
    amount: str
    desc: str
    deduction_rule: str
    retry_policy: str | None = None
    bounce_penalty: str | None = None
    weekday_schedule: list[WeekdayDeduction] | None = None


class FlexibleRepaymentResponse(BaseModel):
    loan_amount: int
    daily_fixed: RepaymentModeDetail
    daily_flexible: RepaymentModeDetail
    monthly: RepaymentModeDetail
    recommended_mode: str
    smart_tip: str


class UpiCreditAnalysisResponse(BaseModel):
    profile_id: str
    features: UpiFeaturesResponse
    credit_score: CreditScoreResponse
    anomaly_warnings: list[AnomalyWarning]
    has_critical_warning: bool
    repayment: FlexibleRepaymentResponse
    transaction_count: int
    recent_transactions: list[dict]
    verification_report: dict


class CreditAnalyzeRequest(BaseModel):
    profile_id: str = Field(default="DEMO-VENDOR", max_length=32)
    loan_amount: int | None = Field(default=None, ge=1000, le=500000)


class UpiHistoryRequest(BaseModel):
    identifier: str | None = Field(default=None, max_length=120)
    upi_id: str | None = Field(default=None, max_length=120)
    pan_number: str | None = Field(default=None, max_length=20)
    mode: str = Field(default="auto", max_length=20)


class WorkerSchemeEvaluationRequest(BaseModel):
    full_name: str = Field(default="Worker", min_length=2, max_length=120)
    aadhaar_number: str = Field(default="XXXX-XXXX-8921", max_length=32)
    daily_earning: int = Field(ge=0, le=100000)
    daily_expense: int = Field(ge=0, le=100000)
    monthly_income: int | None = Field(default=None, ge=0, le=3000000)
    age: int = Field(default=30, ge=16, le=99)
    occupation: str = Field(default="Street Vendor / Gig Worker", min_length=2, max_length=120)
    location: str = Field(default="Gujarat", max_length=120)
    language: str = Field(default="hi", max_length=10)


class EligibleSchemeDetail(BaseModel):
    scheme_name: str
    category: str
    is_eligible: bool
    qualification_reason: str
    financial_benefit: str
    official_url: str
    tag: str


class WorkerReportData(BaseModel):
    full_name: str
    masked_aadhaar: str
    age: int
    occupation: str
    location: str
    daily_earning: int
    daily_expense: int
    net_daily_buffer: int
    monthly_income: int
    income_stability_score: int
    ai_fraud_score: int
    document_authenticity: int
    eligible_loan_tier: int
    eligible_loan_amount: int
    recommended_edi_per_day: int
    approval_probability: int
    recommended_scheme: str
    recommended_banks: list[str]
    matched_schemes: list[EligibleSchemeDetail]
    ineligible_schemes: list[EligibleSchemeDetail]
    generated_at: str
    report_id: str


class WorkerSchemeEvaluationResponse(BaseModel):
    status: str
    message: str
    report: WorkerReportData

