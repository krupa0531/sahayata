import fs from "fs";

let appCode = fs.readFileSync("src/App.jsx", "utf8");

const oldNav = `{["Home", "About Us", "Help"].map((item, i) => {
              const navLabels = {
                "Home": t("navHome", "Home"),
                "About Us": t("navAbout", "About Us"),
                "Help": t("navHelp", "Help Center")
              };
              return (
                <a href="#" key={item} className={\`nav-item\${(item === "Home" && currentPath === "/") || (item === "About Us" && currentPath === "/about") || (item === "Help" && currentPath === "/help") ? " active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo(item === "About Us" ? "/about" : item === "Help" ? "/help" : "/"); }}>
                  {navLabels[item] || item}
                </a>
              );
            })}`;

const newNav = `{["Home", "AI Financial Twin", "About Us", "Help"].map((item, i) => {
              const navLabels = {
                "Home": t("navHome", "Home"),
                "AI Financial Twin": lang === "hi" ? "साई AI असिस्टेंट" : lang === "gu" ? "સાઈ AI અસિસ્ટન્ટ" : "Sai AI Assistant",
                "About Us": t("navAbout", "About Us"),
                "Help": t("navHelp", "Help Center")
              };
              const target = item === "AI Financial Twin" ? "/financial-twin" : item === "About Us" ? "/about" : item === "Help" ? "/help" : "/";
              return (
                <a href="#" key={item} className={\`nav-item\${currentPath === target ? " active" : ""}\`} onClick={(e) => { e.preventDefault(); navigateTo(target); }}>
                  {navLabels[item] || item}
                </a>
              );
            })}`;

if (appCode.includes(oldNav)) {
  appCode = appCode.replace(oldNav, newNav);
  fs.writeFileSync("src/App.jsx", appCode, "utf8");
  console.log("Successfully added AI Financial Twin (Sai) to header navigation bar");
} else {
  console.log("oldNav pattern not found directly");
}
