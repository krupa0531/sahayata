import fs from "fs";

let polishCss = fs.readFileSync("src/polish.css", "utf8");

const pureWhiteStyle = `

/* ==========================================================================
   PURE WHITE THEME FOR ADVANCED ANALYTICS ACCORDION & ALL INNER CARDS
   ========================================================================== */
.advanced-tools-eye-friendly {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 20px !important;
  padding: 24px !important;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.06) !important;
  color: #0f172a !important;
  margin-top: 40px !important;
}

.advanced-tools-eye-friendly summary {
  color: #0f172a !important;
  background: #f8fafc !important;
  padding: 16px 20px !important;
  border-radius: 14px !important;
  border: 1px solid #e2e8f0 !important;
  font-weight: 800 !important;
}

.advanced-tools-eye-friendly .card,
.advanced-tools-eye-friendly .advanced-grid > div,
.advanced-tools-eye-friendly .advanced-full > div,
.advanced-tools-eye-friendly article,
.advanced-tools-eye-friendly section,
.advanced-tools-eye-friendly div[class*="card"],
.advanced-tools-eye-friendly div[class*="panel"],
.advanced-tools-eye-friendly div[class*="box"] {
  background: #ffffff !important;
  color: #0f172a !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04) !important;
  border-radius: 16px !important;
}

.advanced-tools-eye-friendly h1,
.advanced-tools-eye-friendly h2,
.advanced-tools-eye-friendly h3,
.advanced-tools-eye-friendly h4,
.advanced-tools-eye-friendly h5,
.advanced-tools-eye-friendly h6,
.advanced-tools-eye-friendly strong,
.advanced-tools-eye-friendly b,
.advanced-tools-eye-friendly td,
.advanced-tools-eye-friendly th {
  color: #0f172a !important;
}

.advanced-tools-eye-friendly p,
.advanced-tools-eye-friendly span:not([class*="badge"]),
.advanced-tools-eye-friendly small,
.advanced-tools-eye-friendly label,
.advanced-tools-eye-friendly li {
  color: #334155 !important;
}

.advanced-tools-eye-friendly input,
.advanced-tools-eye-friendly select,
.advanced-tools-eye-friendly textarea {
  background: #f8fafc !important;
  color: #0f172a !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 10px !important;
}

.advanced-tools-eye-friendly table {
  background: #ffffff !important;
  color: #0f172a !important;
  border-color: #e2e8f0 !important;
}

.advanced-tools-eye-friendly tr,
.advanced-tools-eye-friendly td,
.advanced-tools-eye-friendly th {
  border-color: #e2e8f0 !important;
  color: #0f172a !important;
}
`;

if (!polishCss.includes("PURE WHITE THEME FOR ADVANCED ANALYTICS")) {
  polishCss += pureWhiteStyle;
  fs.writeFileSync("src/polish.css", polishCss, "utf8");
  console.log("Successfully appended Pure White Theme rules for Advanced Analytics section to polish.css");
} else {
  console.log("Rules already present in polish.css");
}
