import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

// Add AboutUsSection import
if (!appCode.includes("AboutUsSection")) {
  appCode = appCode.replace(
    'import HelpCenter from "./components/HelpCenter";',
    'import HelpCenter from "./components/HelpCenter";\nimport AboutUsSection from "./components/AboutUsSection";'
  );
}

// Render AboutUsSection and HelpCenter above footer
const footerMarker = '<footer className="footer">';
if (!appCode.includes("<AboutUsSection") && appCode.includes(footerMarker)) {
  const replacement = `          <AboutUsSection lang={lang} />
          <HelpCenter lang={lang} navigateTo={navigateTo} />

      <footer className="footer">`;
  appCode = appCode.replace(footerMarker, replacement);
}

fs.writeFileSync("src/App.jsx", appCode, "utf8");
console.log("Successfully integrated AboutUsSection and HelpCenter in App.jsx");
