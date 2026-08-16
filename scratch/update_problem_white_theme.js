import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

const oldProblemSection = `{/* PROBLEM OBSTACLES SECTION */}
          <div className="section-dark-theme">
            <section className="section" id="problem-section">
              <div className="section-inner">
                <div className="eyebrow">{t("probEyebrow", "Identify the obstacles")}</div>
                <h2 className="section-title">{t("probTitle", "Formal credit door kyu hai?")}</h2>
                <p className="section-sub">{t("probSub", "Unorganised workers ke liye main barriers ko aasan bhasha mein samjhein.")}</p>
                <div className="prob-grid">
                  {PROBLEMS.map(({ Icon, title, desc }) => (
                    <div key={title} className="prob-card">
                      <div className="prob-icon"><Icon size={24} /></div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>`;

const newProblemSection = `{/* PROBLEM OBSTACLES SECTION (WHITE BACKGROUND THEME) */}
          <div className="section-light-theme" style={{ background: "#ffffff", color: "#0f172a", padding: "70px 0", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <section className="section" id="problem-section">
              <div className="section-inner" style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 20px" }}>
                <div className="eyebrow" style={{ color: "#0284c7", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t("probEyebrow", "Identify the obstacles")}</div>
                <h2 className="section-title" style={{ color: "#0f172a", fontSize: "34px", fontWeight: "800", marginTop: "8px", marginBottom: "12px" }}>{t("probTitle", "Why is formal credit out of reach?")}</h2>
                <p className="section-sub" style={{ color: "#64748b", fontSize: "16px", marginBottom: "36px" }}>{t("probSub", "Understand the main barriers for unorganised workers in simple language.")}</p>
                
                <div className="prob-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
                  {PROBLEMS.map(({ Icon, title, desc }) => (
                    <div key={title} className="prob-card" style={{ background: "#F8FAFC", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "20px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", transition: "transform 0.2s ease, boxShadow 0.2s ease" }}>
                      <div className="prob-icon" style={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                        <Icon size={24} />
                      </div>
                      <h3 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>{title}</h3>
                      <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>`;

if (appCode.includes(oldProblemSection)) {
  appCode = appCode.replace(oldProblemSection, newProblemSection);
  fs.writeFileSync("src/App.jsx", appCode, "utf8");
  console.log("Successfully set White Background Theme for Problem Obstacles Section");
} else {
  console.log("oldProblemSection pattern not found directly");
}
