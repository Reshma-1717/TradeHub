import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={styles.wrapper}>
    <div style={styles.code}>404</div>
    <h1 style={styles.title}>Page Not Found</h1>
    <p style={styles.text}>The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="btn-primary" style={styles.link}>Back to Dashboard</Link>
  </div>
);

const styles = {
  wrapper: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-base)", padding: 20 },
  code: { fontSize: 64, fontWeight: 700, color: "var(--gold)" },
  title: { fontSize: 20, fontWeight: 600, color: "var(--text-primary)", marginTop: 8 },
  text: { fontSize: 13, color: "var(--text-muted)", marginTop: 6, marginBottom: 20 },
  link: { padding: "10px 24px" },
};

export default NotFound;
