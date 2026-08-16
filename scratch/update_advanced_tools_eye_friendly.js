import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

const oldAdvancedBlock = `<details className="advanced-tools" open={advancedToolsOpen} onToggle={(event) => setAdvancedToolsOpen(event.currentTarget.open)} style={{ marginTop: "40px", background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px" }}>
                  <summary style={{ fontSize: "16px", fontWeight: "700", color: "#38bdf8", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {journey.advanced} <span style={{ fontSize: "12px", background: "rgba(56, 189, 248, 0.15)", padding: "4px 12px", borderRadius: "99px", color: "#38bdf8" }}>{journey.optional}</span>
                  </summary>`;

const newAdvancedBlock = `<details className="advanced-tools-eye-friendly" open={advancedToolsOpen} onToggle={(event) => setAdvancedToolsOpen(event.currentTarget.open)} style={{ marginTop: "50px", background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)", border: "1px solid #CBD5E1", borderRadius: "24px", padding: "28px", boxShadow: "0 8px 30px rgba(0,0,0,0.06)", color: "#0F172A", transition: "all 0.3s ease" }}>
                  <summary style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0284c7" }} />
                      {journey.advanced}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: "700", background: "#E0F2FE", color: "#0369A1", border: "1px solid #BAE6FD", padding: "4px 14px", borderRadius: "99px" }}>{journey.optional}</span>
                  </summary>`;

if (appCode.includes(oldAdvancedBlock)) {
  appCode = appCode.replace(oldAdvancedBlock, newAdvancedBlock);
  fs.writeFileSync("src/App.jsx", appCode, "utf8");
  console.log("Successfully updated Advanced Analytics Accordion to Eye-Friendly Soft Theme");
} else {
  console.log("oldAdvancedBlock pattern not found directly");
}
