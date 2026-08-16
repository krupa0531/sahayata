import { useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, CircleAlert, Mic, ShieldCheck, Sparkles, WalletCards } from "lucide-react";

const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const LABELS = {
  en: {
    cockpit: "Personal Finance Cockpit",
    title: "Your Sahayata Snapshot",
    greeting: "Hello! Your financial health is stable.",
    score: "UPI Financial Health",
    repayment: "Today's Repayment",
    due: "Due today",
    safe: "Your repayment is safe",
    tip: "Tip: regular UPI collections over the next 7 days can strengthen your score.",
    matcher: "Best Schemes for You",
    type: "Your Work",
    age: "Age",
    apply: "Apply for Loan",
    trust: "Never share your OTP",
    securityTitle: "Security & OTP Protection",
    securityHelp: "Never share an OTP on any call, WhatsApp message, or voice assistant.",
    voiceHelp: "Tap the mic beside a form field and say your name, daily income, or account digits to fill it automatically.",
    vendor: "Street vendor",
    delivery: "Delivery partner",
    wage: "Daily wage worker",
    voiceReady: "Voice-ready Form",
  },
  hi: {
    cockpit: "व्यक्तिगत वित्त कॉकपिट",
    title: "आपका सहायता स्नैपशॉट",
    greeting: "नमस्ते! आपका वित्तीय स्वास्थ्य स्थिर है।",
    score: "UPI वित्तीय स्वास्थ्य स्कोर",
    repayment: "आज का पुनर्भुगतान",
    due: "आज देय",
    safe: "पुनर्भुगतान सुरक्षित है",
    tip: "सुझाव: अगले 7 दिनों में नियमित UPI संग्रह आपके स्कोर को और मजबूत बनाएगा।",
    matcher: "आपके लिए सर्वश्रेष्ठ योजनाएं",
    type: "आपका कार्य",
    age: "आयु",
    apply: "ऋण के लिए आवेदन करें",
    trust: "OTP कभी साझा न करें",
    securityTitle: "सुरक्षा एवं OTP संरक्षण",
    securityHelp: "किसी भी कॉल, व्हाट्सएप या वॉयस असिस्टेंट पर OTP कभी साझा न करें।",
    voiceHelp: "फॉर्म फ़ील्ड के पास माइक दबाकर अपना नाम, दैनिक आय या खाता नंबर बोलकर ऑटो-फिल करें।",
    vendor: "स्ट्रीट वेंडर (रेहड़ी-पटरी)",
    delivery: "डिलीवरी पार्टनर",
    wage: "दैनिक वेतनभोगी श्रमिक",
    voiceReady: "वॉयस-सक्षम फॉर्म",
  },
  gu: {
    cockpit: "વ્યક્તિગત ફાઇનાન્સ કોકપિટ",
    title: "તમારો સહાયતા સ્નેપશોટ",
    greeting: "નમસ્તે! તમારું નાણાકીય સ્વાસ્થ્ય સ્થિર છે.",
    score: "UPI નાણાકીય સ્વાસ્થ્ય સ્કોર",
    repayment: "આજની ચુકવણી",
    due: "આજે બાકી",
    safe: "ચુકવણી સુરક્ષિત છે",
    tip: "ટીપ: આગામી ૭ દિવસમાં નિયમિત UPI કલેક્શન તમારા સ્કોરને મજબૂત બનાવશે.",
    matcher: "તમારા માટે શ્રેષ્ઠ યોજનાઓ",
    type: "તમારો વ્યવસાય",
    age: "ઉંમર",
    apply: "લોન માટે અરજી કરો",
    trust: "OTP ક્યારેય શેર કરશો નહીં",
    securityTitle: "સુરક્ષા અને OTP રક્ષણ",
    securityHelp: "કોઈપણ કૉલ, WhatsApp કે વૉઇસ આસિસ્ટન્ટ પર ક્યારેય OTP શેર કરશો નહીં.",
    voiceHelp: "ફોર્મ ફીલ્ડ પાસે માઇક દબાવીને તમારું નામ, દૈનિક આવક કે એકાઉન્ટ વિગતો બોલીને ઓટો-ફિલ કરો.",
    vendor: "સ્ટ્રીટ વેન્ડર (ફેરીવાળા)",
    delivery: "ડિલિવરી પાર્ટનર",
    wage: "દૈનિક શ્રમિક",
    voiceReady: "વૉઇસ-સક્ષમ ફોર્મ",
  }
};

export default function FinancialPulse({ schemes = [], eligibleAmount = 15000, lang = "en", onApply }) {
  const [workerType, setWorkerType] = useState("vendor");
  const [age, setAge] = useState(29);
  const score = Math.min(92, Math.max(58, 62 + Math.round(eligibleAmount / 2500)));
  const labels = LABELS[lang] || LABELS.en;

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

  const card = { background: "linear-gradient(135deg, #0f2d52, #146c73)", border: "1px solid rgba(94,234,212,.34)", borderRadius: 20, padding: 22, color: "white", boxShadow: "0 18px 45px rgba(8,47,73,.22)" };
  const panel = { background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 14, padding: 14 };

  return (
    <section aria-label="Personal financial dashboard" style={{ ...card, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#99f6e4", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: ".07em" }}>
            <Sparkles size={15} /> {labels.cockpit}
          </div>
          <h2 style={{ margin: "7px 0 4px", fontSize: 24 }}>{labels.title}</h2>
          <p style={{ margin: 0, color: "#d1fae5" }}>{labels.greeting}</p>
        </div>
        <div style={{ ...panel, minWidth: 180 }}>
          <div style={{ color: "#a7f3d0", fontSize: 12 }}>{labels.score}</div>
          <div style={{ display: "flex", alignItems: "end", gap: 8, marginTop: 3 }}>
            <strong style={{ fontSize: 38 }}>{score}</strong>
            <span style={{ paddingBottom: 9, color: "#a7f3d0" }}>/100</span>
          </div>
          <div style={{ height: 7, background: "rgba(255,255,255,.20)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${score}%`, height: "100%", background: "#5eead4", borderRadius: 999 }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={panel}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#fde68a", fontWeight: 700 }}>
            <WalletCards size={18} /> {labels.repayment}
          </div>
          <strong style={{ display: "block", fontSize: 26, marginTop: 8 }}>
            {money(Math.max(40, Math.round(eligibleAmount / 300)))}
          </strong>
          <span style={{ color: "#d1fae5", fontSize: 13 }}>{labels.due} · Flexible EDI</span>
          <div style={{ color: "#86efac", display: "flex", gap: 5, marginTop: 9, fontSize: 13 }}>
            <CheckCircle2 size={16} /> {labels.safe}
          </div>
        </div>
        <div style={panel}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#bfdbfe", fontWeight: 700 }}>
            <Mic size={18} /> {labels.voiceReady}
          </div>
          <p style={{ color: "#e0f2fe", fontSize: 13, lineHeight: 1.45, margin: "9px 0 0" }}>{labels.voiceHelp}</p>
        </div>
        <div style={panel}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#fef3c7", fontWeight: 700 }}>
            <ShieldCheck size={18} /> {labels.securityTitle}
          </div>
          <p style={{ color: "#fefce8", fontSize: 13, lineHeight: 1.45, margin: "9px 0 0" }}>{labels.securityHelp}</p>
        </div>
      </div>

      <div style={{ ...panel, marginTop: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <BadgeCheck size={18} color="#5eead4" />
          <strong>{labels.matcher}</strong>
          <label style={{ marginLeft: "auto", fontSize: 12 }}>
            {labels.type}{" "}
            <select value={workerType} onChange={(event) => setWorkerType(event.target.value)} style={{ marginLeft: 5, borderRadius: 6, padding: "4px 6px" }}>
              <option value="vendor">{labels.vendor}</option>
              <option value="delivery">{labels.delivery}</option>
              <option value="wage">{labels.wage}</option>
            </select>
          </label>
          <label style={{ fontSize: 12 }}>
            {labels.age}{" "}
            <input type="number" min="18" max="75" value={age} onChange={(event) => setAge(Number(event.target.value))} style={{ marginLeft: 5, width: 48, borderRadius: 6, padding: "4px 6px" }} />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {bestSchemes.map((scheme) => (
            <span key={scheme.name} style={{ background: "rgba(255,255,255,.14)", borderRadius: 999, padding: "6px 10px", fontSize: 12 }}>
              {scheme.name}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
        <span style={{ color: "#ccfbf1", fontSize: 13 }}>
          <CircleAlert size={15} style={{ verticalAlign: "-3px", marginRight: 5 }} />
          {labels.tip}
        </span>
        <button onClick={onApply} style={{ border: 0, borderRadius: 9, background: "#fbbf24", color: "#422006", padding: "10px 14px", fontWeight: 800, cursor: "pointer" }}>
          {labels.apply} · {money(eligibleAmount)}
        </button>
      </div>
    </section>
  );
}
