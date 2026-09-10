import React from "react";

const StatCard = ({ label, value, change, changeColor, sub }) => (
  <div className="card" style={styles.card}>
    <div style={styles.label}>{label}</div>
    <div style={styles.value}>{value}</div>
    {change && <div style={{ ...styles.change, color: changeColor || "var(--text-muted)" }}>{change}</div>}
    {sub && <div style={styles.sub}>{sub}</div>}
  </div>
);

const styles = {
  card: { padding: "14px 16px", flex: 1 },
  label: { fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 },
  value: { fontSize: 20, fontWeight: 700, color: "var(--text-primary)" },
  change: { fontSize: 11, marginTop: 4, fontWeight: 500 },
  sub: { fontSize: 11, color: "var(--text-muted)", marginTop: 4 },
};

export default StatCard;
