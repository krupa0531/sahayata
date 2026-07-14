import { useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, CircleAlert, Mic, ShieldCheck, Sparkles, WalletCards } from "lucide-react";

const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

export default function FinancialPulse({ schemes = [], eligibleAmount = 15000, lang = "en", onApply }) {
  const [workerType, setWorkerType] = useState("vendor");
  const [age, setAge] = useState(29);
  const score = Math.min(92, Math.max(58, 62 + Math.round(eligibleAmount / 2500)));
  const bestSchemes = useMemo(() => {
    const preferred = workerType === "vendor"
      ? ["PM SVANidhi", "Jan Dhan Yojana", "e-Shram Portal"]
      : workerType === "delivery"
        ? ["e-Shram Portal", "Jan Dhan Yojana", "PM-SYM Pension"]
        : ["e-Shram Portal", "PM-SYM Pension", "Jan Dhan Yojana"];
    return preferred
      .map((name) => schemes.find((scheme) => scheme.name === name))
      .filter(Boolean)
      .slice(0, age > 40 ? 2 : 3);
  }, [age, schemes, workerType]);

  const labels = lang === "hi"
    ? {
        title: "Aaj ka Sahayata Snapshot", greeting: "Namaste! Aapki financial health stable hai.",
        score: "UPI Financial Health", repayment: "Aaj ka repayment", due: "Aaj due", safe: "Repayment safe hai",
        tip: "Tip: agle 7 din regular UPI collection se score aur behtar hoga.", matcher: "Aapke liye best schemes",
        type: "Aap ka kaam", age: "Umar", apply: "Loan ke liye apply karein", trust: "OTP kabhi share na karein",
        securityTitle: "Security aur OTP suraksha", securityHelp: "Kisi call, WhatsApp ya voice assistant ko OTP kabhi mat batayein.",
        voiceHelp: "Har form field ke paas mic dabakar naam, daily income ya account digits bolkar form auto-fill karein.",
        vendor: "Street vendor", delivery: "Delivery partner", wage: "Daily wage worker",
      }
    : {
        title: "Your Sahayata Snapshot", greeting: "Hello! Your financial health is stable.",
        score: "UPI Financial Health", repayment: "Today's repayment", due: "Due today", safe: "Your repayment is safe",
        tip: "Tip: regular UPI collections over the next 7 days can strengthen your score.", matcher: "Best schemes for you",
        type: "Your work", age: "Age", apply: "Apply for loan", trust: "Never share your OTP",
        securityTitle: "Security and OTP safety", securityHelp: "Never share an OTP on any call, WhatsApp message, or voice assistant.",
        voiceHelp: "Tap the mic beside a form field and say your name, daily income, or account digits to fill it automatically.",
        vendor: "Street vendor", delivery: "Delivery partner", wage: "Daily wage worker",
      };

  const card = { background: "linear-gradient(135deg, #0f2d52, #146c73)", border: "1px solid rgba(94,234,212,.34)", borderRadius: 20, padding: 22, color: "white", boxShadow: "0 18px 45px rgba(8,47,73,.22)" };
  const panel = { background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 14, padding: 14 };

  return (
    <section aria-label="Personal financial dashboard" style={{ ...card, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#99f6e4", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: ".07em" }}><Sparkles size={15} /> Personal finance cockpit</div>
          <h2 style={{ margin: "7px 0 4px", fontSize: 24 }}>{labels.title}</h2>
          <p style={{ margin: 0, color: "#d1fae5" }}>{labels.greeting}</p>
        </div>
        <div style={{ ...panel, minWidth: 180 }}>
          <div style={{ color: "#a7f3d0", fontSize: 12 }}>{labels.score}</div>
          <div style={{ display: "flex", alignItems: "end", gap: 8, marginTop: 3 }}><strong style={{ fontSize: 38 }}>{score}</strong><span style={{ paddingBottom: 9, color: "#a7f3d0" }}>/100</span></div>
          <div style={{ height: 7, background: "rgba(255,255,255,.20)", borderRadius: 999, overflow: "hidden" }}><div style={{ width: `${score}%`, height: "100%", background: "#5eead4", borderRadius: 999 }} /></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={panel}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#fde68a", fontWeight: 700 }}><WalletCards size={18} /> {labels.repayment}</div>
          <strong style={{ display: "block", fontSize: 26, marginTop: 8 }}>{money(Math.max(40, Math.round(eligibleAmount / 300)))}</strong>
          <span style={{ color: "#d1fae5", fontSize: 13 }}>{labels.due} · Flexible EDI</span>
          <div style={{ color: "#86efac", display: "flex", gap: 5, marginTop: 9, fontSize: 13 }}><CheckCircle2 size={16} /> {labels.safe}</div>
        </div>
        <div style={panel}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#bfdbfe", fontWeight: 700 }}><Mic size={18} /> Voice-ready form</div>
          <p style={{ color: "#e0f2fe", fontSize: 13, lineHeight: 1.45, margin: "9px 0 0" }}>{labels.voiceHelp}</p>
        </div>
        <div style={panel}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#fef3c7", fontWeight: 700 }}><ShieldCheck size={18} /> {labels.securityTitle}</div>
          <p style={{ color: "#fefce8", fontSize: 13, lineHeight: 1.45, margin: "9px 0 0" }}>{labels.securityHelp}</p>
        </div>
      </div>

      <div style={{ ...panel, marginTop: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <BadgeCheck size={18} color="#5eead4" /><strong>{labels.matcher}</strong>
          <label style={{ marginLeft: "auto", fontSize: 12 }}>{labels.type} <select value={workerType} onChange={(event) => setWorkerType(event.target.value)} style={{ marginLeft: 5, borderRadius: 6, padding: "4px 6px" }}><option value="vendor">{labels.vendor}</option><option value="delivery">{labels.delivery}</option><option value="wage">{labels.wage}</option></select></label>
          <label style={{ fontSize: 12 }}>{labels.age} <input type="number" min="18" max="75" value={age} onChange={(event) => setAge(Number(event.target.value))} style={{ marginLeft: 5, width: 48, borderRadius: 6, padding: "4px 6px" }} /></label>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>{bestSchemes.map((scheme) => <span key={scheme.name} style={{ background: "rgba(255,255,255,.14)", borderRadius: 999, padding: "6px 10px", fontSize: 12 }}>{scheme.name}</span>)}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 14, flexWrap: "wrap" }}><span style={{ color: "#ccfbf1", fontSize: 13 }}><CircleAlert size={15} style={{ verticalAlign: "-3px", marginRight: 5 }} />{labels.tip}</span><button onClick={onApply} style={{ border: 0, borderRadius: 9, background: "#fbbf24", color: "#422006", padding: "10px 14px", fontWeight: 800, cursor: "pointer" }}>{labels.apply} · {money(eligibleAmount)}</button></div>
    </section>
  );
}
