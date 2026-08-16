import fs from "fs";

const cleanAppContent = `import React, { useState, useEffect } from "react";
import { Languages, ShieldCheck, Banknote, BriefcaseBusiness } from "lucide-react";
import "./App.css";
import "./polish.css";

import SahayataHomepage from "./components/SahayataHomepage";
import FinancialTwinModule from "./components/FinancialTwinModule";
import AdminAnalyticsModule from "./components/AdminAnalyticsModule";
import GovernmentSchemesGuide from "./components/GovernmentSchemesGuide";
import HelpCenter from "./components/HelpCenter";
import AuthModal from "./components/AuthModal";
import VoiceAssistant from "./components/VoiceAssistant";

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("sahayata_lang") || "en");
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("sahayata_lang", newLang);
  };

  return (
    <div className="app-root-shell">
      {/* GLOBAL NAVBAR */}
      <header className="header" style={{ position: "sticky", top: 0, zIndex: 1000, background: "rgba(5, 8, 22, 0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="header-inner" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px" }}>
          
          {/* BRAND LOGO */}
          <div className="brand-block" onClick={() => navigateTo("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="brand-flag" style={{ display: "flex", flexDirection: "column", width: "4px", height: "24px", borderRadius: "2px", overflow: "hidden" }}>
              <span style={{ height: "33.3%", background: "#ff9933" }} />
              <span style={{ height: "33.3%", background: "#ffffff" }} />
              <span style={{ height: "33.3%", background: "#138808" }} />
            </div>
            <div>
              <div className="brand-title" style={{ fontSize: "20px", fontWeight: "800", background: "linear-gradient(135deg, #ffffff, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sahayata AI</div>
              <div className="brand-sub" style={{ fontSize: "11px", color: "#94a3b8" }}>Financial Inclusion Portal</div>
            </div>
          </div>

          {/* MAIN NAV LINKS */}
          <nav className="simple-nav" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <a href="#" className={\`nav-item \${currentPath === "/" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/"); }}>
              Home
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/financial-twin" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/financial-twin"); }}>
              🤖 Sai AI Assistant
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/admin" || currentPath === "/admin-dashboard" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/admin"); }}>
              📊 Admin ML Console
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/about" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/about"); }}>
              About Us
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/help" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/help"); }}>
              Help Center
            </a>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div className="lang-selector-container">
              <Languages size={16} color="#38bdf8" />
              <select
                className="lang-select"
                value={lang}
                onChange={(e) => changeLang(e.target.value)}
                style={{ background: "rgba(15, 23, 42, 0.9)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 10px", fontSize: "13px" }}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            <button
              className="btn-primary-sm"
              style={{ background: "linear-gradient(135deg, #00e5ff, #3b82f6)", color: "#050816", fontWeight: "800", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer" }}
              onClick={() => navigateTo("/financial-twin")}
            >
              Start AI Chat
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC PAGE ROUTER */}
      <main className="main-content-router">
        {currentPath === "/financial-twin" ? (
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
      </main>

      {/* FOOTER */}
      <footer className="footer" style={{ background: "#050816", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "30px 20px", color: "#94a3b8", textAlign: "center" }}>
        <div className="footer-inner" style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p>© 2026 Bharat Sarkar. Ministry of Finance, Government of India.</p>
          <div className="footer-links" style={{ display: "flex", justifyContent: "center", gap: "20px", margin: "12px 0" }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#94a3b8", textDecoration: "none" }}>Website Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#94a3b8", textDecoration: "none" }}>Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#94a3b8", textDecoration: "none" }}>Accessibility</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#94a3b8", textDecoration: "none" }}>Sitemap</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#94a3b8", textDecoration: "none" }}>Contact</a>
          </div>
          <div className="footer-tricolor" style={{ display: "flex", height: "3px", width: "120px", margin: "16px auto 0 auto", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ flex: 1, background: "#ff9933" }} />
            <div style={{ flex: 1, background: "#ffffff" }} />
            <div style={{ flex: 1, background: "#138808" }} />
          </div>
        </div>
      </footer>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={setUser}
        />
      )}

      {currentPath !== "/financial-twin" && (
        <VoiceAssistant lang={lang} changeLang={changeLang} navigateTo={navigateTo} />
      )}
    </div>
  );
}
`;

fs.writeFileSync("src/App.jsx", cleanAppContent, "utf8");
console.log("Successfully clean-rewrote App.jsx with full router setup");
