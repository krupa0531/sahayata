import fs from "fs";

let content = fs.readFileSync("src/components/analytics/GlowingKpiCards.jsx", "utf8");

// Remove SVG sparkline block
const startMarker = '<svg className="kpi-sparkline-svg"';
const endMarker = '</svg>';

while (content.includes(startMarker)) {
  const sIdx = content.indexOf(startMarker);
  const eIdx = content.indexOf(endMarker, sIdx) + endMarker.length;
  content = content.substring(0, sIdx) + content.substring(eIdx);
}

fs.writeFileSync("src/components/analytics/GlowingKpiCards.jsx", content, "utf8");
console.log("Successfully removed sparkline graph lines from GlowingKpiCards.jsx");
