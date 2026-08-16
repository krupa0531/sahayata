import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

// 1. Add top-level imports
if (!appCode.includes('import SahayataHomepage from "./components/SahayataHomepage";')) {
  appCode = `import SahayataHomepage from "./components/SahayataHomepage";\nimport FinancialTwinModule from "./components/FinancialTwinModule";\nimport AdminAnalyticsModule from "./components/AdminAnalyticsModule";\n` + appCode;
}

// 2. Replace header action buttons to include Admin ML Console & Sai AI Assistant
const oldHeaderActions = `<div className="header-actions">`;
const newHeaderActions = `<div className="header-actions">
            <button className="btn-primary-sm" style={{ background: 'linear-gradient(135deg, #00e5ff, #3b82f6)', color: '#050816', fontWeight: 'bold' }} onClick={() => navigateTo('/financial-twin')}>
              🤖 Sai AI Twin
            </button>
            <button className="btn-outline" onClick={() => navigateTo('/admin')}>
              📊 Admin ML Console
            </button>`;

if (appCode.includes(oldHeaderActions) && !appCode.includes("Sai AI Twin")) {
  appCode = appCode.replace(oldHeaderActions, newHeaderActions);
}

// 3. Replace main route body
const oldRouteBlockStart = `{currentPath === "/admin-dashboard" ? (`;
const footerBlockStart = `<footer className="footer">`;

const oldBodyStartIdx = appCode.indexOf(oldRouteBlockStart);
const oldBodyEndIdx = appCode.indexOf(footerBlockStart);

if (oldBodyStartIdx !== -1 && oldBodyEndIdx !== -1) {
  const newRouteBody = `{currentPath === "/financial-twin" ? (
        <FinancialTwinModule lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/admin" || currentPath === "/admin-dashboard" ? (
        <AdminAnalyticsModule lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/about" ? (
        <GovernmentSchemesGuide lang={lang} />
      ) : currentPath === "/help" ? (
        <HelpCenter lang={lang} navigateTo={navigateTo} />
      ) : (
        <SahayataHomepage lang={lang} changeLang={changeLang} navigateTo={navigateTo} onOpenAuth={setAuthMode} />
      )}

      `;
  appCode = appCode.substring(0, oldBodyStartIdx) + newRouteBody + appCode.substring(oldBodyEndIdx);
}

fs.writeFileSync("src/App.jsx", appCode, "utf8");
console.log("Successfully restored full Sahayata App (Futuristic White-Blue Earth Globe Homepage, Sai AI Financial Twin, 8-Layer Admin ML Console)");
