import { useEffect, useState } from "react";
import { getSocialSecurity } from "../api";
import SpeechButton from "./SpeechButton";

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function SocialSecurity({ lang = "en" }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSocialSecurity().then(setData).catch(() => setData(null));
  }, []);

  const title = lang === "hi" ? "Samajik Suraksha" : lang === "gu" ? "Samajik Suraksha" : "Social Security";
  const loading = lang === "hi" ? "Social-security status load ho raha hai..." : "Loading social-security status...";

  if (!data) {
    return <div className="card card-accent-teal"><div className="card-sub">{loading}</div></div>;
  }

  if (data.status !== "linked") {
    const message = lang === "hi"
      ? "PM-SYM pension ya Jan Dhan account abhi link nahi hai. Verified balance ya overdraft tabhi dikhega jab official bank/scheme integration complete ho."
      : data.message;
    return (
      <div className="card card-accent-teal">
        <div className="eyebrow">Social Security</div>
        <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <IconShield /> {title}
          <SpeechButton text={`${title}. ${message}`} lang={lang} />
        </div>
        <div className="card-sub">{message}</div>
        <div className="pension-card" style={{ marginTop: 16 }}>
          <div className="p-lbl">Status</div>
          <div className="p-val">Not linked</div>
          <div className="p-sub">No sample balance, pension corpus, or withdrawal amount is shown.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-accent-teal">
      <div className="eyebrow">Social Security</div>
      <div className="card-title"><IconShield /> {title}</div>
      <div className="card-sub">Verified partner data</div>
      <div className="pension-grid">
        {data.pension_cards.map(({ lbl, val, cls, sub, unit }) => (
          <div key={lbl} className={`pension-card ${cls || ""}`}>
            <div className="p-lbl">{lbl}</div>
            <div className={`p-val ${cls || ""}`}>{val.replace("INR", "₹")}{unit}</div>
            <div className="p-sub">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
