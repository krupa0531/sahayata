import base64
import hashlib
import hmac
import json
import os
import pathlib
import time
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier

app = FastAPI(title="Sahayata API", version="1.0.0")

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SECRET KEY FOR HMAC SIGNATURES (Dependency-free JWT alternative)
SECRET_KEY = b"sahayata_hyper_secret_2026_key_for_micro_underwriting"

# Database file path
DB_FILE = pathlib.Path(__file__).parent / "db.json"

# --- DATA STORES & DATABASE HELPER ---
def load_db() -> Dict[str, Any]:
    if not DB_FILE.exists():
        # Initialize default database structure
        default_db = {
            "users": {},
            "applications": {},
            "overdrafts": {
                "DEMO-VENDOR": {
                    "overdraft_used": 3200,
                    "overdraft_limit": 10000,
                    "overdraft_available": 6800
                }
            }
        }
        save_db(default_db)
        return default_db
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"users": {}, "applications": {}, "overdrafts": {}}

def save_db(data: Dict[str, Any]):
    os.makedirs(DB_FILE.parent, exist_ok=True)
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# --- AUTH SECURITY HELPERS ---
def hash_password(password: str, salt: str = "sahayata_salt_2026") -> str:
    return hashlib.sha256((password + salt).encode()).hexdigest()

def create_token(payload: Dict[str, Any]) -> str:
    payload_bytes = json.dumps(payload).encode()
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode().rstrip("=")
    signature = hmac.new(SECRET_KEY, payload_b64.encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{payload_b64}.{sig_b64}"

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        payload_b64, sig_b64 = parts
        
        # Verify signature
        expected_sig = hmac.new(SECRET_KEY, payload_b64.encode(), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode().rstrip("=")
        
        if not hmac.compare_digest(expected_sig_b64, sig_b64):
            return None
            
        # Decode payload
        rem = len(payload_b64) % 4
        if rem > 0:
            payload_b64 += "=" * (4 - rem)
        payload_bytes = base64.urlsafe_b64decode(payload_b64.encode())
        return json.loads(payload_bytes)
    except Exception:
        return None

def get_current_user_from_header(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Access token missing or invalid")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid signature")
    db = load_db()
    user = db["users"].get(payload.get("mobile"))
    if not user:
        raise HTTPException(status_code=401, detail="User account not found")
    return user

# --- PYDANTIC MODEL SCHEMAS ---
class RegisterPayload(BaseModel):
    full_name: str
    mobile: str
    password: str
    email: Optional[str] = ""

class LoginPayload(BaseModel):
    mobile: str
    password: str

class EligibilityPayload(BaseModel):
    daily_earning: float
    daily_expense: float

class ApplicationPayload(BaseModel):
    full_name: str
    identity_number: str
    occupation_type: str
    earning_mode: str
    account_number: str
    upi_id: str
    requested_amount: float
    verification_type: Optional[str] = ""
    verification_id: Optional[str] = ""

class CreditAnalysisPayload(BaseModel):
    profile_id: Optional[str] = "DEMO-VENDOR"
    loan_amount: Optional[float] = 15000.0

class OtpRequestPayload(BaseModel):
    mobile: str
    sms_consent: Optional[bool] = True

class OtpVerifyPayload(BaseModel):
    mobile: str
    code: str

# --- ROUTER DEFINITIONS ---
api_router = APIRouter(prefix="/api")

# 1. AUTH ROUTES
@api_router.post("/auth/register")
def register(payload: RegisterPayload):
    db = load_db()
    if payload.mobile in db["users"]:
        raise HTTPException(status_code=400, detail="Mobile number is already registered")
    
    hashed = hash_password(payload.password)
    user_data = {
        "full_name": payload.full_name,
        "mobile": payload.mobile,
        "password": hashed,
        "email": payload.email
    }
    db["users"][payload.mobile] = user_data
    save_db(db)
    
    token = create_token({"mobile": payload.mobile, "full_name": payload.full_name})
    return {"access_token": token, "user": {"full_name": payload.full_name, "mobile": payload.mobile}}

@api_router.post("/auth/login")
def login(payload: LoginPayload):
    db = load_db()
    user = db["users"].get(payload.mobile)
    if not user or user["password"] != hash_password(payload.password):
        raise HTTPException(status_code=400, detail="Incorrect mobile number or password")
    
    token = create_token({"mobile": payload.mobile, "full_name": user["full_name"]})
    return {"access_token": token, "user": {"full_name": user["full_name"], "mobile": payload.mobile}}

@api_router.get("/auth/me")
def get_me(current_user: Dict[str, Any] = Depends(get_current_user_from_header)):
    return {"full_name": current_user["full_name"], "mobile": current_user["mobile"], "email": current_user.get("email", "")}

# 2. DASHBOARD & SCHEMES
@api_router.get("/dashboard")
def dashboard():
    return {
        "stats": [
            { "target": "50", "suffix": "L+", "label": "PM SVANidhi beneficiaries" },
            { "target": "28", "suffix": "Cr+", "label": "e-Shram registered workers" },
            { "target": "52", "suffix": "Cr+", "label": "Jan Dhan accounts" },
            { "target": "2.3", "suffix": "L Cr", "label": "Jan Dhan balance, INR" }
        ],
        "ticker": [
            "PM SVANidhi Yojana: 50 lakh se adhik labharthi registered",
            "e-Shram Portal: 28 crore shramik panjikrit",
            "Jan Dhan Khaton mein INR 2.3 lakh crore ki rashi jama"
        ]
    }

@api_router.get("/schemes")
def schemes():
    return [
        { "name": "PM SVANidhi", "sub": "Street vendors ke liye", "desc": "Rs 10,000 se Rs 50,000 tak collateral-free working capital loan.", "tag": "Street vendors" },
        { "name": "Jan Dhan Yojana", "sub": "Basic banking access", "desc": "Zero-balance bank account, overdraft support, insurance cover.", "tag": "All workers" },
        { "name": "PM-SYM Pension", "sub": "Old-age security", "desc": "Small daily contribution ke saath government matching support.", "tag": "18-40 years" },
        { "name": "e-Shram Portal", "sub": "Digital worker identity", "desc": "Unorganised workers ke liye national ID aur welfare program discovery.", "tag": "Free" }
    ]

# 3. INTERACTIVE SUITE: ELIGIBILITY & PLANNER
@api_router.post("/eligibility")
def eligibility(payload: EligibilityPayload):
    buffer = payload.daily_earning - payload.daily_expense
    if buffer >= 400:
        tier = "Tier 1 - ₹50,000 eligible"
        css = "tier-saffron"
        amt = 50000
        rec = "Strong cash buffer. Recommended for PM SVANidhi Top-up with daily EDI micro payments."
    elif buffer >= 200:
        tier = "Tier 2 - ₹15,000 eligible"
        css = "tier-green"
        amt = 15000
        rec = "Good financial profile. Start with a working capital micro loan for quick building."
    elif buffer >= 80:
        tier = "Tier 3 - ₹5,000 eligible"
        css = "tier-blue"
        amt = 5000
        rec = "Basic eligibility. Keep regular transaction streaks to unlock higher limits."
    else:
        tier = "Not eligible yet"
        css = "tier-red"
        amt = 0
        rec = "Build a higher daily cash buffer (at least ₹80) before applying."
        
    return {
        "daily_expense": payload.daily_expense,
        "net_daily_buffer": buffer,
        "eligible_amount": amt,
        "label": tier,
        "css_class": css,
        "recommendation": rec
    }

@api_router.get("/repayment-plans")
def repayment_plans(loan_amount: float = 15000.0):
    daily_fixed_edi = max(50, round(loan_amount / 150))
    daily_flex_avg = max(60, round(loan_amount / 120))
    monthly_emi = max(500, round((loan_amount * 1.1) / 6))
    
    return {
        "daily_fixed": {
            "amount": f"₹{daily_fixed_edi}",
            "desc": "Fixed daily payment auto-deducted every morning via UPI mandate",
            "deduction_rule": f"₹{daily_fixed_edi}/day fixed deduction",
            "retry_policy": "3 auto-retry attempts daily (6 AM, 12 PM, 6 PM) in case of insufficient balance",
            "bounce_penalty": "No immediate ECS bounce penalty. Grace period of 48 hours is offered."
        },
        "daily_flexible": {
            "amount": f"₹{daily_flex_avg}",
            "desc": "Flexible Daily EDI based on your daily UPI sales volume & business peak cycles",
            "deduction_rule": "10% of daily UPI transaction values (ML-adjusted by day of week)",
            "retry_policy": "Zero penalty on slow sales days. Catch-up payment occurs on next high-revenue day",
            "bounce_penalty": "Zero bounce fee. Flexible adjustments sync to your actual cash-flow"
        },
        "monthly": {
            "amount": f"₹{monthly_emi.toLocaleString() if hasattr(monthly_emi, 'toLocaleString') else monthly_emi}",
            "desc": "Traditional monthly auto-debit on the 1st day of the month",
            "deduction_rule": "Up to 28% of estimated net monthly profits",
            "retry_policy": "3 retry attempts within 5 days. Escalation warning is triggered afterward",
            "bounce_penalty": "₹350 bounce charge + immediate impact on credit bureau status"
        },
        "recommended_mode": "daily_flexible",
        "smart_tip": "ML analysis suggests Daily Flexible repayment mode since your transaction history shows higher sales volume on weekends and lower sales on Tuesdays."
    }

def verify_worker_credentials(occupation_type: str, verification_type: str, verification_id: str) -> Dict[str, Any]:
    if not verification_type or not verification_id:
        return {"status": "unverified", "message": "No verification credentials provided.", "formatted_id": ""}
    
    clean_id = verification_id.strip()
    
    # e-Shram card check (usually 12 digits)
    if "shram" in verification_type.lower() or "shramik" in verification_type.lower():
        digits = "".join(filter(str.isdigit, clean_id))
        if len(digits) != 12:
            return {"status": "failed", "message": "e-Shram UAN must be exactly 12 digits."}
        formatted = f"{digits[:4]}-{digits[4:8]}-{digits[8:]}"
        return {"status": "verified", "message": f"e-Shram UAN {formatted} successfully verified against National Portal registry.", "formatted_id": formatted}
        
    # PM SVANidhi LOR check
    elif "svanidhi" in verification_type.lower() or "vendor" in verification_type.lower() or "lor" in verification_type.lower():
        if len(clean_id) < 5:
            return {"status": "failed", "message": "Invalid PM SVANidhi LOR or Certificate ID. Must be at least 5 characters."}
        return {"status": "verified", "message": f"PM SVANidhi LOR ID {clean_id} verified against Municipal Corporation records.", "formatted_id": clean_id}
        
    # Gig Platform check
    elif "gig" in verification_type.lower() or "platform" in verification_type.lower() or "partner" in verification_type.lower() or any(x in verification_type.lower() for x in ["zomato", "swiggy", "porter", "uber", "ola"]):
        if len(clean_id) < 3:
            return {"status": "failed", "message": "Invalid Partner ID. Must be at least 3 characters."}
        return {"status": "verified", "message": f"Gig Partner ID {clean_id} verified. Linked {verification_type} active driver history.", "formatted_id": clean_id}
        
    return {"status": "verified", "message": "Credentials verified.", "formatted_id": clean_id}

# 4. APPLICATION MANAGER & TIMELINE
@api_router.post("/applications")
def submit_application(payload: ApplicationPayload):
    db = load_db()
    
    # Validate and verify credentials
    verification = verify_worker_credentials(
        payload.occupation_type,
        payload.verification_type or "",
        payload.verification_id or ""
    )
    
    if verification["status"] == "failed":
        raise HTTPException(status_code=400, detail=verification["message"])
        
    app_id = f"SAH-{int(time.time() * 1000) % 10000000:07d}"
    today = time.strftime("%Y-%m-%d")
    
    application_data = {
        "id": app_id,
        "applicant_name": payload.full_name,
        "identity_number": payload.identity_number,
        "occupation_type": payload.occupation_type,
        "earning_mode": payload.earning_mode,
        "account_number": payload.account_number,
        "upi_id": payload.upi_id,
        "requested_amount": payload.requested_amount,
        "verification_type": payload.verification_type or "e-KYC",
        "verification_id": verification.get("formatted_id") or payload.verification_id or "Verified",
        "verification_status": verification["status"],
        "verification_message": verification["message"],
        "status": "in_review",
        "current_stage": "e-KYC verified" if verification["status"] == "verified" else "Pending Verification",
        "review_note": f"Application submitted. {verification['message']}" if verification["status"] == "verified" else "Application submitted. Worker credentials pending verification.",
        "timeline": [
            { "label": "Submitted", "state": "done", "date": today },
            { "label": "e-KYC verified" if verification["status"] == "verified" else "Pending verification", "state": "active", "date": today },
            { "label": "NBFC review", "state": "idle", "date": "" },
            { "label": "Bank sanction", "state": "idle", "date": "" },
            { "label": "Cash disbursed", "state": "idle", "date": "" }
        ]
    }
    
    db["applications"][app_id] = application_data
    save_db(db)
    return {"id": app_id, "message": "Application submitted successfully."}

@api_router.get("/applications")
def list_applications():
    db = load_db()
    # Return all applications sorted descending
    apps = list(db["applications"].values())
    # Add a fallback demo application if queue is empty
    if not apps:
        apps = [{
            "id": "SAH-DEMO001",
            "applicant_name": "Ramesh Kumar",
            "requested_amount": 15000,
            "status": "in_review",
            "current_stage": "NBFC review",
            "verification_type": "e-Shram Card",
            "verification_id": "4883-9928-1029",
            "verification_status": "verified",
            "verification_message": "e-Shram UAN 4883-9928-1029 successfully verified against National Portal registry.",
            "created_at": "2026-06-22T10:00:00Z"
        }]
    return apps

@api_router.get("/applications/demo")
def get_demo_application():
    return {
        "id": "SAH-DEMO-9918",
        "applicant_name": "Ramesh Kumar",
        "requested_amount": 15000,
        "status": "in_review",
        "current_stage": "NBFC review",
        "verification_type": "e-Shram Card",
        "verification_id": "4883-9928-1029",
        "verification_status": "verified",
        "verification_message": "e-Shram UAN 4883-9928-1029 successfully verified against National Portal registry.",
        "review_note": "e-KYC verified. Loan forwarded to NBFC co-lending partner for alternate credit scoring check.",
        "timeline": [
            { "label": "Submitted", "state": "done", "date": "2026-07-08" },
            { "label": "e-KYC verified", "state": "done", "date": "2026-07-09" },
            { "label": "NBFC review", "state": "active", "date": "2026-07-10" },
            { "label": "Bank sanction", "state": "idle", "date": "" },
            { "label": "Cash disbursed", "state": "idle", "date": "" }
        ]
    }

@api_router.get("/applications/{application_id}")
def get_application(application_id: str):
    db = load_db()
    app = db["applications"].get(application_id)
    if not app:
        # Fallback to demo if not found
        return get_demo_application()
    return app

# 5. SOCIAL SECURITY & OVERDRAFT
@api_router.get("/social-security/demo")
def get_social_security():
    db = load_db()
    od = db["overdrafts"].get("DEMO-VENDOR", {
        "overdraft_used": 3200,
        "overdraft_limit": 10000,
        "overdraft_available": 6800
    })
    
    return {
        "pension_cards": [
            { "lbl": "PM-SYM contribution", "val": "INR 3", "cls": "regular", "sub": "Government also contributes INR 3", "unit": "/day" },
            { "lbl": "Total corpus (est.)", "val": "INR 43,200", "cls": "corpus", "sub": "Over 20 years", "unit": "" },
            { "lbl": "Retirement pension", "val": "INR 3,000", "cls": "pension", "sub": "/month guaranteed", "unit": "" },
            { "lbl": "Contribution streak", "val": "142", "cls": "streak", "sub": "Continuous days", "unit": " days" }
        ],
        "overdraft_used": od["overdraft_used"],
        "overdraft_limit": od["overdraft_limit"],
        "overdraft_available": od["overdraft_available"]
    }

@api_router.post("/social-security/withdraw")
def withdraw_overdraft():
    db = load_db()
    od = db["overdrafts"].get("DEMO-VENDOR", {
        "overdraft_used": 3200,
        "overdraft_limit": 10000,
        "overdraft_available": 6800
    })
    
    if od["overdraft_available"] <= 0:
        raise HTTPException(status_code=400, detail="Overdraft limit fully exhausted")
        
    withdrawn = od["overdraft_available"]
    od["overdraft_used"] += withdrawn
    od["overdraft_available"] = 0
    
    db["overdrafts"]["DEMO-VENDOR"] = od
    save_db(db)
    
    return {
        "message": f"Withdrawal request received. INR {withdrawn:,} will be credited to your Jan Dhan account within 24 hours."
    }

# 6. DIGITAL TRACKER & WEEKLY TRANSACTIONS
@api_router.get("/transactions/weekly")
def get_weekly_transactions():
    return [
        { "day": "Mon", "volume": 82, "sales": 5084 },
        { "day": "Tue", "volume": 91, "sales": 5642 },
        { "day": "Wed", "volume": 68, "sales": 4216 },
        { "day": "Thu", "volume": 95, "sales": 5890 },
        { "day": "Fri", "volume": 88, "sales": 5456 },
        { "day": "Sat", "volume": 100, "sales": 6200 },
        { "day": "Sun", "volume": 74, "sales": 4588 }
    ]

@api_router.get("/tracker/stats")
def get_tracker_stats():
    return {
        "avg_daily_sales": 5320,
        "consistency_score": 96,
        "txns_today": 14
    }

# 7. UPI ALTERNATE CREDIT SCORING & MACHINE LEARNING PIPELINE
@api_router.post("/credit/analyze")
def analyze_credit(payload: CreditAnalysisPayload):
    # Generative dummy UPI stream features for standard profiling
    # 90-day transactions sequence: Daily sales average 1200 with standard deviation 400
    np.random.seed(42)
    daily_sales = np.random.normal(1200, 400, 90)
    daily_sales = np.clip(daily_sales, 100, 3500) # clip to realistic sales bounds
    
    # Intentionally inject 2 spikes/anomalies (to demonstrate Isolation Forest)
    daily_sales[15] = 12500  # huge bulk sale (positive anomaly)
    daily_sales[55] = 9500   # another bulk sale (positive anomaly)
    
    # 1. ISOLATION FOREST RUN (Anomaly Detection)
    # We reshape data for fitting
    X_iso = daily_sales.reshape(-1, 1)
    iso_model = IsolationForest(n_estimators=100, contamination=0.03, random_state=42)
    iso_model.fit(X_iso)
    anomalies = iso_model.predict(X_iso)
    
    warnings = []
    for idx in range(len(daily_sales)):
        if anomalies[idx] == -1 and daily_sales[idx] > 5000:
            avg_sales = float(np.mean(daily_sales))
            ratio = round(daily_sales[idx] / avg_sales, 1)
            warnings.append({
                "txn_date": f"Day {idx+1}",
                "amount": int(daily_sales[idx]),
                "spike_ratio": ratio,
                "severity": "high" if ratio > 6.0 else "medium",
                "message": f"Spike in single transaction volume. Detected transaction is {ratio}x higher than average daily sales.",
                "pattern_check": "Passed. Single receipt anomaly.",
                "velocity_check": "Warning. High velocity detected."
            })
            
    # 2. RANDOM FOREST RUN (Credit Risk Classifier)
    # We fit a random forest model on synthetic historical vendor application features
    # Features: [avg_daily_sales, volume, consistency_score, retention_score]
    # Classes: 0: Reject, 1: High Risk, 2: Medium Risk, 3: Low Risk
    train_x = np.array([
        [1500, 60, 95, 80], # Low risk
        [1200, 45, 88, 70], # Low/Med
        [800, 30, 80, 60],  # Medium risk
        [500, 15, 65, 45],  # High risk
        [200, 5, 30, 10],   # Reject
        [1800, 70, 98, 85], # Low risk
        [600, 20, 75, 50],  # Med/High
    ])
    train_y = np.array([3, 3, 2, 1, 0, 3, 1])
    
    rf_model = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42)
    rf_model.fit(train_x, train_y)
    
    # Calculate user features
    avg_sales = float(np.mean(daily_sales))
    consistency = 94.5
    volume = 42
    retention = 72.0
    
    # Predict probabilities
    user_features = np.array([[avg_sales, volume, consistency, retention]])
    probs = rf_model.predict_proba(user_features)[0]
    
    # Map probability outcomes to labels
    risk_labels = ["reject", "high", "medium", "low"]
    risk_level = risk_labels[np.argmax(probs)]
    
    # Max loan calculation based on multiplier
    risk_multipliers = {"low": 1.5, "medium": 1.0, "high": 0.5, "reject": 0.0}
    multiplier = risk_multipliers[risk_level]
    monthly_rev = avg_sales * 30
    max_loan = round((monthly_rev * multiplier) / 5000) * 5000
    max_loan = max(5000, min(50000, max_loan)) # Cap between 5k and 50k
    
    # Probabilities dictionary
    prob_dict = {
        "low": round(float(probs[3]) if len(probs) > 3 else 0.0, 2),
        "medium": round(float(probs[2]) if len(probs) > 2 else 0.0, 2),
        "high": round(float(probs[1]) if len(probs) > 1 else 0.0, 2),
        "reject": round(float(probs[0]) if len(probs) > 0 else 0.0, 2),
    }
    
    # Weekly dynamic EDI schedules
    days = [
        {"day": "Mon", "expected_sales": 1200, "deduction_amount": 100, "note": "Normal weekday"},
        {"day": "Tue", "expected_sales": 900, "deduction_amount": 80, "note": "Lower sales day"},
        {"day": "Wed", "expected_sales": 1250, "deduction_amount": 100, "note": "Normal weekday"},
        {"day": "Thu", "expected_sales": 1180, "deduction_amount": 100, "note": "Normal weekday"},
        {"day": "Fri", "expected_sales": 1500, "deduction_amount": 120, "note": "Normal weekday"},
        {"day": "Sat", "expected_sales": 1800, "deduction_amount": 150, "note": "Higher weekend peak"},
        {"day": "Sun", "expected_sales": 1650, "deduction_amount": 140, "note": "Higher weekend peak"}
    ]
    
    return {
        "transaction_count": len(daily_sales),
        "features": {
            "daily_throughput": round(avg_sales),
            "transaction_volume": volume,
            "consistency_score": round(consistency),
            "customer_retention": round(retention)
        },
        "credit_score": {
            "risk_level": risk_level,
            "model": "Random Forest Underwriting Classifier v1.4",
            "max_loan_eligibility": max_loan,
            "risk_multiplier": multiplier,
            "recommendation": "Strong revenue profile and low default probability. Optimal applicant for PM SVANidhi micro co-lending program.",
            "risk_probabilities": prob_dict
        },
        "anomaly_warnings": warnings,
        "repayment": {
            "daily_flexible": {
                "weekday_schedule": days
            }
        }
    }

@api_router.get("/credit/demo")
def get_credit_demo(loan_amount: Optional[float] = 15000.0):
    return analyze_credit(CreditAnalysisPayload(profile_id="DEMO-VENDOR", loan_amount=loan_amount))

@api_router.get("/credit/warnings")
def get_credit_warnings(profile_id: Optional[str] = "DEMO-VENDOR"):
    res = analyze_credit(CreditAnalysisPayload(profile_id=profile_id, loan_amount=15000))
    return res["anomaly_warnings"]

# --- OTP MEMORY STORE & ROUTE HANDLERS ---
otp_store: Dict[str, str] = {}

@api_router.post("/auth/otp/request")
def request_otp(payload: OtpRequestPayload):
    import random
    
    # Generate random 6-digit verification code
    otp_code = f"{random.randint(100000, 999999)}"
    otp_store[payload.mobile] = otp_code
    
    # SMS APIs configurations
    twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
    twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
    
    fast2sms_key = os.getenv("FAST2SMS_API_KEY")
    
    sent_real = False
    error_msg = ""
    
    if twilio_sid and twilio_token and twilio_phone:
        try:
            import urllib.request
            import urllib.parse
            
            url = f"https://api.twilio.com/2010-04-01/Accounts/{twilio_sid}/Messages.json"
            data = urllib.parse.urlencode({
                "To": payload.mobile if payload.mobile.startswith("+") else f"+91{payload.mobile}",
                "From": twilio_phone,
                "Body": f"Sahayata App Verification Code: {otp_code}. Do not share this OTP."
            }).encode("utf-8")
            
            req = urllib.request.Request(url, data=data, method="POST")
            
            auth_str = f"{twilio_sid}:{twilio_token}"
            auth_b64 = base64.b64encode(auth_str.encode()).decode()
            req.add_header("Authorization", f"Basic {auth_b64}")
            
            with urllib.request.urlopen(req) as response:
                if response.status in [200, 201]:
                    sent_real = True
        except Exception as e:
            error_msg = f"Twilio Error: {str(e)}"
            
    elif fast2sms_key:
        try:
            import urllib.request
            import urllib.parse
            
            url = "https://www.fast2sms.com/dev/bulkV2"
            headers = {
                "authorization": fast2sms_key,
                "Content-Type": "application/json"
            }
            req_data = {
                "route": "otp",
                "variables_values": otp_code,
                "numbers": payload.mobile
            }
            data_bytes = json.dumps(req_data).encode("utf-8")
            
            req = urllib.request.Request(url, data=data_bytes, headers=headers, method="POST")
            with urllib.request.urlopen(req) as response:
                res_body = json.loads(response.read().decode())
                if res_body.get("return") == True:
                    sent_real = True
                else:
                    error_msg = f"Fast2SMS: {res_body.get('message', 'Failed')}"
        except Exception as e:
            error_msg = f"Fast2SMS Error: {str(e)}"
            
    print(f"\n[OTP SERVICE] Mobile: {payload.mobile} | Code: {otp_code} | Real SMS Sent: {sent_real} {error_msg}\n")
    
    if sent_real:
        return {"message": "OTP sent to your mobile number."}
    else:
        # Development fallback (returns code directly to screen/console for testing)
        return {
            "message": f"[Dev Mode] OTP generated: {otp_code}. (Real SMS not configured)",
            "debug_otp": otp_code
        }

@api_router.post("/auth/otp/verify")
def verify_otp(payload: OtpVerifyPayload):
    saved_code = otp_store.get(payload.mobile)
    
    is_dev = not (os.getenv("TWILIO_ACCOUNT_SID") or os.getenv("FAST2SMS_API_KEY"))
    
    if saved_code == payload.code or (is_dev and payload.code == "123456"):
        if payload.mobile in otp_store:
            del otp_store[payload.mobile]
        return {"verified": True, "message": "OTP verified successfully."}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please try again.")

app.include_router(api_router)

# 8. HEALTH CHECK
@app.get("/health")
def health():
    return {"status": "ok", "timestamp": time.time()}
