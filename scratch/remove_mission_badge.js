import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

const oldBadgeBlock = `<div className="hero-badge">
                  <span className="pulse-dot" />
                  {t("missionBadge", "Mission Mode - Active 2026")}
                </div>`;

if (appCode.includes(oldBadgeBlock)) {
  appCode = appCode.replace(oldBadgeBlock, "");
  fs.writeFileSync("src/App.jsx", appCode, "utf8");
  console.log("Successfully removed Mission Mode - Active 2026 badge box");
} else {
  console.log("oldBadgeBlock pattern not found directly");
}
