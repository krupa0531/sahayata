import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

const oldNavAndHeader = `<nav className="simple-nav" aria-label="Main navigation">
            <a href="#" className={\`nav-item \${currentPath === "/" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/"); }}>
              {t("navHome", "Home")}
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/financial-twin" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/financial-twin"); }}>
              🤖 Sai AI Twin
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/admin" || currentPath === "/admin-dashboard" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/admin"); }}>
              📊 Admin ML Console
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/about" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/about"); }}>
              {t("navAbout", "About Us")}
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/help" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/help"); }}>
              {t("navHelp", "Help Center")}
            </a>
          </nav>
          
          <div className="header-actions">
            <div className="lang-selector-container">
              <Languages size={16} className="lang-icon" />
              <select
                className="lang-select"
                value={lang}
                onChange={(e) => changeLang(e.target.value)}
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            <button
              className="btn-primary-sm"
              style={{ background: "linear-gradient(135deg, #00e5ff, #3b82f6)", color: "#050816", fontWeight: "800" }}
              onClick={() => navigateTo("/financial-twin")}
            >
              Start AI Chat
            </button>
          </div>`;

const newNavAndHeader = `<nav className="simple-nav" aria-label="Main navigation">
            <a href="#" className={\`nav-item \${currentPath === "/" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/"); }}>
              Home
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/financial-twin" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/financial-twin"); }}>
              AI
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/about" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/about"); }}>
              About Us
            </a>
            <a href="#" className={\`nav-item \${currentPath === "/help" ? "active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo("/help"); }}>
              Help
            </a>
          </nav>
          
          <div className="header-actions">
            <div className="lang-selector-container">
              <Languages size={16} className="lang-icon" />
              <select
                className="lang-select"
                value={lang}
                onChange={(e) => changeLang(e.target.value)}
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            {/* BANK DASHBOARD BUTTON WITH BANK ICON */}
            <button
              className="btn-outline"
              style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0, 229, 255, 0.1)", border: "1px solid rgba(0, 229, 255, 0.35)", color: "#00e5ff", fontWeight: "700", padding: "8px 16px", borderRadius: "10px", cursor: "pointer" }}
              onClick={() => navigateTo("/admin")}
            >
              <Landmark size={17} /> Bank Dashboard
            </button>

            {/* REGISTER AND LOGIN BUTTONS */}
            {user ? (
              <span className="user-chip">Hi, {user.full_name ? user.full_name.split(" ")[0] : "User"}</span>
            ) : (
              <>
                <button className="btn-primary-sm" style={{ fontWeight: "700" }} onClick={() => setAuthMode("register")}>Register</button>
                <button className="btn-outline" style={{ fontWeight: "700" }} onClick={() => setAuthMode("login")}>Login</button>
              </>
            )}
          </div>`;

if (appCode.includes(oldNavAndHeader)) {
  appCode = appCode.replace(oldNavAndHeader, newNavAndHeader);
  fs.writeFileSync("src/App.jsx", appCode, "utf8");
  console.log("Successfully updated Header navigation in App.jsx");
} else {
  console.log("oldNavAndHeader pattern not found directly");
}
