import fs from "fs";

const content = fs.readFileSync("scratch/update_twin_module.js", "utf8");
// Extract fileContent string or write directly
const startMarker = 'const fileContent = `';
const startIndex = content.indexOf(startMarker) + startMarker.length;
const endIndex = content.lastIndexOf('`;\n\nfs.writeFileSync');
const actualCode = content.substring(startIndex, endIndex);

fs.writeFileSync("src/components/FinancialTwinModule.jsx", actualCode, "utf8");
console.log("Successfully updated src/components/FinancialTwinModule.jsx");
