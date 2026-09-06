import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, clearError } from "../redux/slices/authSlice";
import { FiTrendingUp, FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}!`);
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Login failed");
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

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to continue trading</p>

        <form onSubmit={handleSubmit} style={styles.form}>
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
              placeholder="Password"
              className="input-field"
              style={styles.inputWithIcon}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Create one</Link>
        </p>

        <div style={styles.demoBox}>
          <div style={styles.demoTitle}>Demo Admin Access</div>
          <div style={styles.demoText}>admin@tradehub.com / Admin@123</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-base)",
    position: "relative",
    overflow: "hidden",
    padding: 20,
  },
  bgGlow: {
    position: "absolute",
    top: "-20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 600,
    height: 600,
    background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    background: "var(--bg-surface)",
    border: "0.5px solid var(--border)",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
    position: "relative",
    zIndex: 1,
  },
  logoWrap: { textAlign: "center", marginBottom: 28 },
  logoIcon: {
    width: 48, height: 48,
    background: "linear-gradient(135deg, var(--gold), var(--gold-bright))",
    borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--bg-base)",
    margin: "0 auto 12px",
  },
  logoText: { fontSize: 18, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.06em" },
  tagline: { fontSize: 11, color: "var(--text-muted)", marginTop: 4 },
  title: { fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "var(--text-muted)", marginBottom: 24 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  inputGroup: { position: "relative" },
  inputIcon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" },
  inputWithIcon: { paddingLeft: 38 },
  submitBtn: { width: "100%", padding: "12px", marginTop: 6, fontSize: 14 },
  footerText: { textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 20 },
  link: { color: "var(--gold)", fontWeight: 500 },
  demoBox: {
    marginTop: 20,
    padding: "10px 14px",
    background: "rgba(201,169,110,0.06)",
    border: "0.5px dashed var(--gold-dim)",
    borderRadius: 8,
    textAlign: "center",
  },
  demoTitle: { fontSize: 10, color: "var(--gold)", fontWeight: 600, marginBottom: 2 },
  demoText: { fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" },
};

export default Login;
