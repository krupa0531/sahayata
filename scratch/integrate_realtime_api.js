import fs from "fs";

let twinCode = fs.readFileSync("src/components/FinancialTwinModule.jsx", "utf8");

// Import real-time sync helpers
if (!twinCode.includes("recordAiConversation")) {
  twinCode = twinCode.replace(
    'import FraudAnalyticsDashboard from "./FraudAnalyticsDashboard.jsx";',
    'import FraudAnalyticsDashboard from "./FraudAnalyticsDashboard.jsx";\nimport { recordAiConversation, recordApplicationSubmission, recordFraudAttempt } from "../services/realtimeSync.js";'
  );
}

// Increment AI Conversation count on every message
if (!twinCode.includes("recordAiConversation();")) {
  twinCode = twinCode.replace(
    'const userMsg = { id: Date.now(), sender: "user", text: textToSend, time: timeStr };',
    'const userMsg = { id: Date.now(), sender: "user", text: textToSend, time: timeStr };\n    recordAiConversation();'
  );
}

// Record fraud attempt when fraud is detected
if (!twinCode.includes("recordFraudAttempt();")) {
  twinCode = twinCode.replace(
    'if (report.isFraud) {',
    'if (report.isFraud) {\n        recordFraudAttempt();'
  );
}

// Record application submission when user completes flow
if (!twinCode.includes("recordApplicationSubmission")) {
  twinCode = twinCode.replace(
    'const appId = "SAH-2026-" + Math.floor(10000 + Math.random() * 90000);',
    'const appId = "SAH-2026-" + Math.floor(10000 + Math.random() * 90000);\n      recordApplicationSubmission({ applicationId: appId, scheme: "PM SVANidhi", lender: "State Bank of India (SBI)", eligibleAmount: "35000" });'
  );
}

fs.writeFileSync("src/components/FinancialTwinModule.jsx", twinCode, "utf8");
console.log("Successfully connected FinancialTwinModule.jsx to Real-time Backend Analytics Sync");
