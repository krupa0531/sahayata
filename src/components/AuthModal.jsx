import { useState } from "react";
import { loginUser, registerUser } from "../api";

export default function AuthModal({ mode, onClose, onSuccess }) {
  const [form, setForm] = useState({ full_name: "", mobile: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = mode === "register"
        ? await registerUser(form)
        : await loginUser({ mobile: form.mobile, password: form.password });
      onSuccess?.(result.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h3>{mode === "register" ? "Worker Registration" : "Login"}</h3>
        <p className="modal-sub">Backend se connected — account banao ya login karo</p>
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="form-field">
              <label>Full name</label>
              <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required />
            </div>
          )}
          <div className="form-field">
            <label>Mobile number</label>
            <input value={form.mobile} onChange={(e) => update("mobile", e.target.value)} required />
          </div>
          {mode === "register" && (
            <div className="form-field">
              <label>Email (optional)</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
          )}
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={6} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary modal-submit" type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "register" ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
