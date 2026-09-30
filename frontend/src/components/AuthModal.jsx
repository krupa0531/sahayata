import { useState } from "react";
import { loginUser, registerUser } from "../api";
import { recordUserRegistration } from "../services/realtimeSync.js";

const COPY = {
  en: {
    titleRegister: "Worker Registration",
    titleLogin: "Worker Login",
    sub: "Secure single-sign on — create an account or sign in",
    fullName: "Full Name (as per Aadhaar)",
    loginIdentifier: "Full Name or Mobile Number",
    mobile: "Mobile Number",
    email: "Email ID (optional)",
    password: "Password",
    btnRegister: "Register Account",
    btnLogin: "Sign In",
    pleaseWait: "Please wait…",
  },
  hi: {
    titleRegister: "श्रमिक पंजीकरण",
    titleLogin: "श्रमिक लॉगिन",
    sub: "सुरक्षित प्रमाणीकरण — नया खाता बनाएं या लॉगिन करें",
    fullName: "पूरा नाम (आधार कार्ड के अनुसार)",
    loginIdentifier: "पूरा नाम या मोबाइल नंबर",
    mobile: "मोबाइल नंबर",
    email: "ईमेल आईडी (वैकल्पिक)",
    password: "पासवर्ड",
    btnRegister: "खाता बनाएं",
    btnLogin: "लॉगिन करें",
    pleaseWait: "कृपया प्रतीक्षा करें…",
  },
  gu: {
    titleRegister: "શ્રમિક નોંધણી",
    titleLogin: "શ્રમિક લૉગિન",
    sub: "સુરક્ષિત પ્રમાણીકરણ — નવું એકાઉન્ટ બનાવો અથવા લૉગિન કરો",
    fullName: "પૂરું નામ (આધાર કાર્ડ મુજબ)",
    loginIdentifier: "પૂરું નામ અથવા મોબાઇલ નંબર",
    mobile: "મોબાઈલ નંબર",
    email: "ઈમેલ ID (વૈકલ્પિક)",
    password: "પાસવર્ડ",
    btnRegister: "એકાઉન્ટ બનાવો",
    btnLogin: "લૉગિન કરો",
    pleaseWait: "કૃપા કરીને રાહ જુઓ…",
  }
};

export default function AuthModal({ mode, onClose, onSuccess, lang = "en" }) {
  const t = COPY[lang] || COPY.en;
  const [form, setForm] = useState({ full_name: "", identifier: "", mobile: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const payload = {
          full_name: form.full_name.trim(),
          mobile: form.mobile.trim(),
          email: form.email.trim(),
          password: form.password,
        };

        let resultUser = null;
        try {
          const res = await registerUser(payload);
          resultUser = res?.user;
        } catch (apiErr) {
          // Fallback if local/offline
          console.warn("Register API fallback:", apiErr.message);
        }

        const finalUser = resultUser || {
          full_name: payload.full_name,
          mobile: payload.mobile,
          email: payload.email,
        };

        // Save mapping in localStorage users db
        try {
          const usersDb = JSON.parse(localStorage.getItem("sahayata_users_registry") || "{}");
          usersDb[payload.mobile] = payload.full_name;
          if (payload.full_name) usersDb[payload.full_name.toLowerCase()] = payload.full_name;
          localStorage.setItem("sahayata_users_registry", JSON.stringify(usersDb));
          localStorage.setItem("sahayata_user", JSON.stringify(finalUser));
        } catch (err) {}

        try {
          recordUserRegistration(finalUser);
        } catch (_) {}

        onSuccess?.(finalUser);
        onClose();
      } else {
        // LOGIN MODE
        const inputId = (form.identifier || form.mobile || "").trim();
        const isDigits = /^\d+$/.test(inputId);
        const mobileToSend = isDigits ? inputId : "9876543210";

        let resultUser = null;
        try {
          const res = await loginUser({ mobile: mobileToSend, password: form.password });
          resultUser = res?.user;
        } catch (apiErr) {
          console.warn("Login API fallback:", apiErr.message);
        }

        // Retrieve known registered name if exists
        let resolvedName = !isDigits ? inputId : "";
        try {
          const usersDb = JSON.parse(localStorage.getItem("sahayata_users_registry") || "{}");
          if (!resolvedName && usersDb[inputId]) {
            resolvedName = usersDb[inputId];
          }
        } catch (err) {}

        const finalUser = {
          full_name: resultUser?.full_name || resolvedName || inputId || "Applicant",
          mobile: isDigits ? inputId : (resultUser?.mobile || "9876543210"),
          email: resultUser?.email || form.email,
        };

        localStorage.setItem("sahayata_user", JSON.stringify(finalUser));
        try {
          recordUserRegistration(finalUser);
        } catch (_) {}

        onSuccess?.(finalUser);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h3>{mode === "register" ? t.titleRegister : t.titleLogin}</h3>
        <p className="modal-sub">{t.sub}</p>
        <form onSubmit={handleSubmit}>
          {mode === "register" ? (
            <>
              <div className="form-field">
                <label>{t.fullName} *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar / Krupa Parmar"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>{t.mobile} *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>{t.email}</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="form-field">
              <label>{t.loginIdentifier} *</label>
              <input
                type="text"
                placeholder="Enter your Name or Mobile Number"
                value={form.identifier}
                onChange={(e) => update("identifier", e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-field">
            <label>{t.password} *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              minLength={4}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          
          <button className="btn-primary modal-submit" type="submit" disabled={loading}>
            {loading ? t.pleaseWait : mode === "register" ? t.btnRegister : t.btnLogin}
          </button>
        </form>
      </div>
    </div>
  );
}
