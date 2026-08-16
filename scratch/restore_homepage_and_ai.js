import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

// Add imports for SahayataHomepage, FinancialTwinModule, AdminAnalyticsModule
if (!appCode.includes("SahayataHomepage")) {
  appCode = appCode.replace(
    'import HelpCenter from "./components/HelpCenter";',
    'import HelpCenter from "./components/HelpCenter";\nimport SahayataHomepage from "./components/SahayataHomepage";\nimport FinancialTwinModule from "./components/FinancialTwinModule";\nimport AdminAnalyticsModule from "./components/AdminAnalyticsModule";'
  );
}

// Support /financial-twin, /admin, and / homepage routing
const oldRouteBlock = `{currentPath === "/admin-dashboard" ? (
        <AdminDashboard lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/about" ? (
        <GovernmentSchemesGuide lang={lang} />
      ) : currentPath === "/help" ? (
        <HelpCenter lang={lang} />
      ) : (`;

const newRouteBlock = `{currentPath === "/financial-twin" ? (
        <FinancialTwinModule lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/admin" || currentPath === "/admin-dashboard" ? (
        <AdminAnalyticsModule lang={lang} navigateTo={navigateTo} />
      ) : currentPath === "/about" ? (
        <GovernmentSchemesGuide lang={lang} />
      ) : currentPath === "/help" ? (
        <HelpCenter lang={lang} />
      ) : (
        <>
          <SahayataHomepage lang={lang} changeLang={changeLang} navigateTo={navigateTo} onOpenAuth={setAuthMode} />`;

if (appCode.includes(oldRouteBlock)) {
  appCode = appCode.replace(oldRouteBlock, newRouteBlock);
}

fs.writeFileSync("src/App.jsx", appCode, "utf8");
console.log("Successfully restored Sahayata Homepage & Sai AI Financial Twin routing in App.jsx");
