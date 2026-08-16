import { detectHomeVoiceIntent } from "../src/services/homeVoiceIntents.js";

console.log("=== VERIFYING HOME VOICE INTENT ENGINE ===\n");

const testCases = [
  { query: "Mujhe loan chahiye.", lang: "hi", expectedIntent: "LOAN_REQUEST" },
  { query: "Can I get a loan?", lang: "en", expectedIntent: "LOAN_REQUEST" },
  { query: "મારે સરકારી યોજનાઓ વિશે જાણવું છે.", lang: "gu", expectedIntent: "GOVERNMENT_SCHEMES" },
  { query: "Mujhe kaun kaun se documents dene hain?", lang: "hi", expectedIntent: "DOCUMENT_REQUIREMENTS" },
  { query: "Mare loan mate kai documents joiye?", lang: "gu", expectedIntent: "DOCUMENT_REQUIREMENTS" },
  { query: "Check my eligibility", lang: "en", expectedIntent: "ELIGIBILITY_CHECK" },
  { query: "Mera application status kahan tak pahuncha?", lang: "hi", expectedIntent: "APPLICATION_STATUS" },
  { query: "What is my UPI credit score?", lang: "en", expectedIntent: "CREDIT_SCORE" },
  { query: "Daily repayment kaise karein?", lang: "hi", expectedIntent: "REPAYMENT" },
  { query: "Help chahiye", lang: "hi", expectedIntent: "BANKING_HELP" },
  { query: "Gujarati ma bolo", lang: "gu", expectedIntent: "LANGUAGE_SWITCH" },
  { query: "Hindi me bolo", lang: "hi", expectedIntent: "LANGUAGE_SWITCH" },
];

let passed = 0;
for (const tc of testCases) {
  const res = detectHomeVoiceIntent(tc.query, tc.lang);
  const ok = res && res.intentKey === tc.expectedIntent;
  if (ok) passed++;
  console.log(`${ok ? "[PASS]" : "[FAIL]"} [${tc.expectedIntent}] Query: "${tc.query}" (${tc.lang})`);
  console.log(`       Response: ${res.responseText.slice(0, 95)}...\n`);
}

console.log(`Final Result: ${passed}/${testCases.length} Tests Passed.`);
if (passed === testCases.length) {
  console.log("\n🌟 ALL 12 HOME PAGE VOICE INTENT TESTS PASSED WITH 100% SUCCESS!");
}
