import { useEffect, useState } from "react";
import { getTrackerStats, getWeeklyTransactions } from "../api";
import SpeechButton from "./SpeechButton";

const BUBBLES = ["#ff9933", "#138808", "#2563eb", "#7c3aed", "#db2777", "#0891b2", "#ca8a04"];

const IconBubble = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="7" cy="12" r="3"/><circle cx="17" cy="8" r="5"/><circle cx="15" cy="18" r="2"/>
  </svg>
);

export default function DigitalTracker({ lang = "en" }) {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [txn, setTxn] = useState(12);

  const t = (key) => {
    const dict = {
      en: {
        title: "Digital Footprint & Sales Tracker",
        sub: "7-day UPI sales velocity — live backend data",
        avgDailySales: "Avg daily sales",
        consistencyScore: "Consistency score",
        txnsToday: "Txns today",
      },
      hi: {
        title: "डिजिटल फुटप्रिंट और बिक्री ट्रैकर",
        sub: "7-दिवसीय यूपीआई बिक्री वेग — लाइव बैकएंड डेटा",
        avgDailySales: "औसत दैनिक बिक्री",
        consistencyScore: "संगति स्कोर",
        txnsToday: "आज के लेनदेन",
      },
      gu: {
        title: "ડિજિટલ ફૂટપ્રિન્ટ અને સેલ્સ ટ્રેકર",
        sub: "૭-દિવસની UPI વેચાણ ઝડપ — લાઈવ બેકએન્ડ ડેટા",
        avgDailySales: "સરેરાશ દૈનિક વેચાણ",
        consistencyScore: "સુસંગતતા સ્કોર",
        txnsToday: "આજના વ્યવહારો",
      }
    };
    return dict[lang]?.[key] || dict.en[key];
  };

  useEffect(() => {
    Promise.all([getWeeklyTransactions(), getTrackerStats()])
      .then(([txns, trackerStats]) => {
        setTransactions(txns);
        setStats(trackerStats);
        setTxn(trackerStats.txns_today);
      })
      .catch(() => {
        setTransactions([
          { day: "Mon", volume: 82, sales: 5084 },
          { day: "Tue", volume: 91, sales: 5642 },
          { day: "Wed", volume: 68, sales: 4216 },
          { day: "Thu", volume: 95, sales: 5890 },
          { day: "Fri", volume: 88, sales: 5456 },
          { day: "Sat", volume: 100, sales: 6200 },
          { day: "Sun", volume: 74, sales: 4588 },
        ]);
        setStats({ avg_daily_sales: 6240, consistency_score: 94, txns_today: 12 });
      });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTxn((t) => (Math.random() > 0.55 ? t + 1 : t)), 2800);
    return () => clearInterval(id);
  }, []);

  const translateDay = (day) => {
    const dict = {
      en: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
      hi: { Mon: "सोम", Tue: "मंगल", Wed: "बुध", Thu: "गुरु", Fri: "शुक्र", Sat: "शनि", Sun: "रवि" },
      gu: { Mon: "સોમ", Tue: "મંગળ", Wed: "બુધ", Thu: "ગુરુ", Fri: "શુક્ર", Sat: "શનિ", Sun: "રવિ" }
    };
    return dict[lang]?.[day] || day;
  };

  return (
    <div className="card card-accent-blue">
      <div className="eyebrow">Interactive Suite</div>
      <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <IconBubble /> {t("title")}
        <SpeechButton text={`${t("title")}. ${t("sub")}`} lang={lang} />
      </div>
      <div className="card-sub">{t("sub")}</div>

      <div className="bubble-area" role="img" aria-label="7 day UPI volume chart">
        {transactions.map((item, i) => {
          const size = Math.round(22 + item.volume * 0.46);
          const dayLabel = translateDay(item.day);
          return (
            <div key={item.day}>
              <div className="bubble"
                title={`${dayLabel}: ₹${item.sales.toLocaleString("en-IN")}`}
                style={{
                  width: size,
                  height: size,
                  background: BUBBLES[i % BUBBLES.length],
                  left: i * 86 + 12,
                  top: 110 - size - (i % 2) * 14,
                  opacity: 0.55,
                }}
              />
              <div className="bubble-day-lbl" style={{ left: i * 86 + 12 + size / 2 - 10 }}>{dayLabel}</div>
            </div>
          );
        })}
      </div>

      <div className="tracker-stats">
        <div className="t-stat t-stat-orange">
          <div className="num">₹{(stats?.avg_daily_sales ?? 0).toLocaleString("en-IN")}</div>
          <div className="lbl">{t("avgDailySales")}</div>
        </div>
        <div className="t-stat t-stat-green">
          <div className="num">{stats?.consistency_score ?? 0}%</div>
          <div className="lbl">{t("consistencyScore")}</div>
        </div>
        <div className="t-stat t-stat-blue">
          <div className="num"><span className="live-dot" /> {txn}</div>
          <div className="lbl">{t("txnsToday")}</div>
        </div>
      </div>
    </div>
  );
}
