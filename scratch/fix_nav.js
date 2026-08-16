import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

const target = `<nav className="simple-nav" aria-label="Main navigation">`;
const replacement = `<nav className="simple-nav" aria-label="Main navigation">
            <button className="btn-primary-sm" style={{ marginRight: '10px', background: 'linear-gradient(135deg, #00e5ff, #3b82f6)', color: '#000', fontWeight: 'bold' }} onClick={() => navigateTo('/financial-twin')}>
              🤖 Sai AI Assistant
            </button>`;

if (appCode.includes(target) && !appCode.includes("Sai AI Assistant")) {
  appCode = appCode.replace(target, replacement);
  fs.writeFileSync("src/App.jsx", appCode, "utf8");
  console.log("Successfully added Sai AI Assistant button to header navigation bar");
}
