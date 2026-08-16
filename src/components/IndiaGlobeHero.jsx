import { motion } from "framer-motion";
import deliveryRiderPhoto from "../assets/delivery-rider-real.jpg";
import streetVendorPhoto from "../assets/street-vendor-india.jpg";
import constructionWorkerPhoto from "../assets/construction-worker-india.jpg";
import earthHero from "../assets/india-earth-hero.png";

const METRICS_DATA = {
  en: [
    ["Gig Workers", "12.4M", "live"],
    ["Delivery Partners", "4.5M", "verified"],
    ["Daily Wage Workers", "150M", "loan"]
  ],
  hi: [
    ["गिग वर्कर्स", "1.24 करोड़", "live"],
    ["डिलीवरी पार्टनर्स", "45 लाख", "verified"],
    ["दैनिक वेतन भोगी", "15 करोड़", "loan"]
  ],
  gu: [
    ["ગીગ વર્કર્સ", "1.24 કરોડ", "live"],
    ["ડિલિવરી પાર્ટનર્સ", "45 લાખ", "verified"],
    ["દૈનિક વેતન મજૂરો", "15 કરોડ", "loan"]
  ]
};

export default function IndiaGlobeHero({ lang = "en" }) {
  const language = ["hi", "gu"].includes(lang) ? lang : "en";
  const metrics = METRICS_DATA[language];

  return (
    <div className="globe-experience" aria-label="India financial inclusion network">
      {/* Background earth focused on India */}
      <motion.img className="earth-hero-image" src={earthHero} alt="Earth focused on India from space" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: [1.03, 1.065, 1.03], x: [0, -8, 0], y: [0, 3, 0] }} transition={{ opacity: { duration: 1.2 }, scale: { duration: 16, repeat: Infinity, ease: "easeInOut" }, x: { duration: 16, repeat: Infinity, ease: "easeInOut" }, y: { duration: 16, repeat: Infinity, ease: "easeInOut" } }} />
      <div className="earth-shadow" />
      <div className="earth-scanlines" />

      {/* Metrics Card on the right */}
      <motion.aside className="network-metrics" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.35 }}>
        <div className="panel-kicker"><span /> Live inclusion pulse</div>
        <h3>One network.<br />Every worker.</h3>
        <div className="network-metrics-grid">
          {metrics.map(([label, value, cls], index) => (
            <motion.div className="network-metric" key={label} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + index * 0.11 }}>
              <span className={cls} />
              <small>{label}</small>
              <strong>{value}</strong>
            </motion.div>
          ))}
        </div>
      </motion.aside>

      {/* Worker avatars overlay */}
      <div className="worker-orbit" aria-label="Workers connected to the network">
        {[deliveryRiderPhoto, streetVendorPhoto, constructionWorkerPhoto].map((photo, index) => (
          <motion.img key={photo} src={photo} alt="Sahayata worker" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8 + index * 0.22, duration: 0.65 }} />
        ))}
      </div>
    </div>
  );
}
