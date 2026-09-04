import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { registerUser, clearError } from "../redux/slices/authSlice";
import { FiTrendingUp, FiMail, FiLock, FiUser } from "react-icons/fi";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (form.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success(`Welcome to TradeHub, ${result.payload.user.name}! You start with $10,000.`);
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.bgGlow} />
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}><FiTrendingUp size={20} /></div>
          <div style={styles.logoText}>TRADEHUB</div>
          <div style={styles.tagline}>Premium Paper Trading Platform</div>
        </div>

        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Start trading with $10,000 virtual funds</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <FiUser style={styles.inputIcon} size={15} />
            <input
              type="text"
              placeholder="Full name"
              className="input-field"
              style={styles.inputWithIcon}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <FiMail style={styles.inputIcon} size={15} />
            <input
              type="email"
              placeholder="Email address"
              className="input-field"
              style={styles.inputWithIcon}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <FiLock style={styles.inputIcon} size={15} />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              className="input-field"
              style={styles.inputWithIcon}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <FiLock style={styles.inputIcon} size={15} />
            <input
              type="password"
              placeholder="Confirm password"
              className="input-field"
              style={styles.inputWithIcon}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--bg-base)", position: "relative", overflow: "hidden", padding: 20,
  },
  bgGlow: {
    position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
    width: 600, height: 600,
    background: "radial-gradient(circle, rgba(46,204,138,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: 16,
    padding: "36px 36px", width: "100%", maxWidth: 400, position: "relative", zIndex: 1,
  },
  logoWrap: { textAlign: "center", marginBottom: 24 },
  logoIcon: {
    width: 48, height: 48, background: "linear-gradient(135deg, var(--gold), var(--gold-bright))",
    borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--bg-base)", margin: "0 auto 12px",
  },
  logoText: { fontSize: 18, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.06em" },
  tagline: { fontSize: 11, color: "var(--text-muted)", marginTop: 4 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "var(--text-muted)", marginBottom: 22 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  inputGroup: { position: "relative" },
  inputIcon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" },
  inputWithIcon: { paddingLeft: 38 },
  submitBtn: { width: "100%", padding: "12px", marginTop: 6, fontSize: 14 },
  footerText: { textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 18 },
  link: { color: "var(--gold)", fontWeight: 500 },
};

export default Register;
