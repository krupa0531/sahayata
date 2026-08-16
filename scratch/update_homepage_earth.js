import fs from "fs";

let homepageCode = fs.readFileSync("src/components/SahayataHomepage.jsx", "utf8");

// 1. Import IndiaGlobeHero
if (!homepageCode.includes("IndiaGlobeHero")) {
  homepageCode = 'import IndiaGlobeHero from "./IndiaGlobeHero";\n' + homepageCode;
}

// 2. Wrap hero section in split grid with Left Earth Globe & Right SAI Content
const oldHeroTag = '<main className="sai-hero-section" ref={heroRef}>';
const newHeroTag = `<main className="sai-hero-section-split" ref={heroRef} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "40px", alignItems: "center", maxWidth: "1400px", margin: "0 auto", padding: "90px 24px 60px 24px" }}>
        
        {/* LEFT COLUMN: India Earth Hero with subtle pulse zoom */}
        <div className="sai-hero-globe-column" style={{ position: "relative", borderRadius: "24px", overflow: "hidden" }}>
          <IndiaGlobeHero lang={lang} />
        </div>

        {/* RIGHT COLUMN: SAI AI Assistant & Floating Prompt Box */}
        <div className="sai-hero-content-column">`;

if (homepageCode.includes(oldHeroTag)) {
  homepageCode = homepageCode.replace(oldHeroTag, newHeroTag);
}

// Close the right column div before ending main tag
const endMainTag = '</main>';
if (homepageCode.includes('</div>\n      </main>')) {
  homepageCode = homepageCode.replace('</div>\n      </main>', '</div>\n        </div>\n      </main>');
} else if (homepageCode.includes('</main>')) {
  const lastMainIdx = homepageCode.indexOf('</main>');
  homepageCode = homepageCode.substring(0, lastMainIdx) + '</div>\n      </main>' + homepageCode.substring(lastMainIdx + 7);
}

fs.writeFileSync("src/components/SahayataHomepage.jsx", homepageCode, "utf8");
console.log("Successfully integrated Pulsing India Earth Hero on Left Column of Sahayata Homepage");
