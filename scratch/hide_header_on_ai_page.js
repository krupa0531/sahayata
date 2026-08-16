import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

const oldHeaderTag = `<header className="header">`;
const newHeaderTag = `{currentPath !== "/financial-twin" && (
        <header className="header">`;

const oldHeaderEnd = `</header>`;
const newHeaderEnd = `</header>
      )}`;

if (appCode.includes(oldHeaderTag) && !appCode.includes(`currentPath !== "/financial-twin" && (`)) {
  appCode = appCode.replace(oldHeaderTag, newHeaderTag);
  appCode = appCode.replace(oldHeaderEnd, newHeaderEnd);
  fs.writeFileSync("src/App.jsx", appCode, "utf8");
  console.log("Successfully hid top global header on AI Financial Twin page");
} else {
  console.log("Header check failed or already hidden");
}
