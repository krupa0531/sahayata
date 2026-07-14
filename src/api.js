const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "sahayata_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err.detail;
    throw new Error(
      typeof detail === "string" ? detail : Array.isArray(detail) ? detail[0]?.msg : `Request failed: ${res.status}`
    );
  }

  return res.json();
}

export async function checkHealth() {
  const res = await fetch("/health");
  if (!res.ok) throw new Error("Backend unavailable");
  return res.json();
}

export function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((data) => {
    setToken(data.access_token);
    return data;
  });
}

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((data) => {
    setToken(data.access_token);
    return data;
  });
}

export function requestMobileOtp(mobile) {
  return request("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ mobile, sms_consent: true }),
  });
}

export function verifyMobileOtp(mobile, code) {
  return request("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ mobile, code }),
  });
}

export function logoutUser() {
  setToken(null);
}

export function getCurrentUser() {
  return request("/auth/me");
}

export function getDashboard() {
  return request("/dashboard");
}

export function getSchemes() {
  return request("/schemes");
}

export function calculateEligibility(dailyEarning, dailyExpense) {
  return request("/eligibility", {
    method: "POST",
    body: JSON.stringify({ daily_earning: dailyEarning, daily_expense: dailyExpense }),
  });
}

export function getRepaymentPlans(loanAmount = 90000) {
  return request(`/repayment-plans?loan_amount=${loanAmount}`);
}

export function submitApplication(payload) {
  return request("/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getDemoApplicationStatus() {
  return request("/applications/demo");
}

export function getApplicationStatus(applicationId) {
  return request(`/applications/${applicationId}`);
}

export function getSocialSecurity() {
  return request("/social-security/demo");
}

export function getWeeklyTransactions() {
  return request("/transactions/weekly");
}

export function getTrackerStats() {
  return request("/tracker/stats");
}

export function withdrawOverdraft() {
  return request("/social-security/withdraw", { method: "POST" });
}

export function analyzeUpiCredit(payload = {}) {
  return request("/credit/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCreditDemo(loanAmount) {
  const query = loanAmount ? `?loan_amount=${loanAmount}` : "";
  return request(`/credit/demo${query}`);
}

export function getCreditWarnings(profileId = "DEMO-VENDOR") {
  return request(`/credit/warnings?profile_id=${profileId}`);
}

export function listApplications() {
  return request("/applications");
}

export function listKycDocuments() {
  return request("/kyc/documents");
}

export function uploadKycDocument(documentType, file) {
  const body = new FormData();
  body.append("document_type", documentType);
  body.append("file", file);
  return request("/kyc/documents", { method: "POST", body });
}

export function getLoanGuidanceAudioUrl(language = "hi") {
  return `${API_BASE}/voice-assistant/loan-guidance/audio?language=${encodeURIComponent(language)}`;
}

export function getLoanGuidance(language = "hi") {
  return request(`/voice-assistant/loan-guidance?language=${encodeURIComponent(language)}`);
}

export async function getPageSpeechAudio(text, language = "hi") {
  const response = await fetch(`${API_BASE}/voice-assistant/speak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  if (!response.ok) throw new Error("Unable to generate speech");
  return URL.createObjectURL(await response.blob());
}
