import fs from "fs";

const content = `/**
 * SAHAYATA REAL-TIME ANALYTICS & BACKEND SYNC SERVICE
 * Synchronizes AI Conversations, Scheme Submissions, and Fraud Alerts to the Admin Dashboard in Real-Time
 */

const SYNC_KEY = "sahayata_analytics_state";

const DEFAULT_STATE = {
  totalWorkersCount: 4,
  submittedApplicationsCount: 0,
  disbursedLoansAmount: 0,
  aiConversationsCount: 0,
  fraudAttemptsCount: 0,
  verifiedDocsCount: 0,
  recentApplications: [],
};

export function getAnalyticsState() {
  try {
    const data = localStorage.getItem(SYNC_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_STATE,
        ...parsed,
      };
    }
  } catch (e) {
    console.warn("Analytics state read error:", e);
  }
  return DEFAULT_STATE;
}

export function saveAnalyticsState(state) {
  try {
    localStorage.setItem(SYNC_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("sahayata_analytics_update"));
  } catch (e) {
    console.warn("Analytics state save error:", e);
  }
}

// RESET ALL COUNTERS TO ZERO (EXCEPT TOTAL WORKERS = 4)
export function resetAnalyticsStateToZero() {
  saveAnalyticsState(DEFAULT_STATE);
  return DEFAULT_STATE;
}

// 1. INCREMENT AI CONVERSATION COUNT (+1 on every Sai chat message)
export function recordAiConversation() {
  const state = getAnalyticsState();
  state.aiConversationsCount = (state.aiConversationsCount || 0) + 1;
  saveAnalyticsState(state);
  return state.aiConversationsCount;
}

// 2. RECORD NEW SCHEME / LOAN APPLICATION SUBMISSION (+1 on application submit)
export function recordApplicationSubmission(application) {
  const state = getAnalyticsState();
  state.submittedApplicationsCount = (state.submittedApplicationsCount || 0) + 1;
  const numericAmount = parseInt((application.eligibleAmount || "15000").replace(/[^0-9]/g, ""), 10) || 15000;
  state.disbursedLoansAmount = (state.disbursedLoansAmount || 0) + numericAmount;

  const newApp = {
    id: application.applicationId || \`SAH-2026-\${Math.floor(10000 + Math.random() * 90000)}\`,
    applicantName: "Ramesh Kumar Patel",
    schemeName: application.scheme || "PM SVANidhi",
    recommendedBank: application.lender || "State Bank of India (SBI)",
    loanAmount: application.eligibleAmount || "₹35,000",
    monthlyIncome: "₹22,000",
    authenticityScore: "96%",
    fraudRisk: "Low (6%)",
    status: "Pending Bank Review",
    submissionTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  state.recentApplications = [newApp, ...(state.recentApplications || []).slice(0, 19)];
  saveAnalyticsState(state);
  return state;
}

// 3. RECORD FRAUD ATTEMPT (+1 when 8-Layer AI Fraud Engine catches fake image)
export function recordFraudAttempt() {
  const state = getAnalyticsState();
  state.fraudAttemptsCount = (state.fraudAttemptsCount || 0) + 1;
  saveAnalyticsState(state);
  return state.fraudAttemptsCount;
}
`;

fs.writeFileSync("src/services/realtimeSync.js", content, "utf8");
console.log("Successfully updated src/services/realtimeSync.js with Total Workers = 4 and all other counters set to 0");
