import React, { useEffect, useState } from "react";
import { adminAPI } from "../api/endpoints";
import { toast } from "react-toastify";
import StatCard from "../components/common/StatCard";

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("overview");
  const [stockForm, setStockForm] = useState({
    symbol: "", companyName: "", currentPrice: "", previousClose: "",
    sector: "Technology", exchange: "NASDAQ",
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers({ limit: 50 }),
      ]);
      setStats(statsRes.data.stats);
      setRecentTrades(statsRes.data.recentTrades);
      setUsers(usersRes.data.users);
    } catch (err) {
      toast.error("Failed to load admin data");
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id);
      toast.success("User status updated");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createStock({
        ...stockForm,
        currentPrice: parseFloat(stockForm.currentPrice),
        previousClose: parseFloat(stockForm.previousClose || stockForm.currentPrice),
      });
      toast.success(`${stockForm.symbol.toUpperCase()} added successfully`);
      setStockForm({ symbol: "", companyName: "", currentPrice: "", previousClose: "", sector: "Technology", exchange: "NASDAQ" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add stock");
    }
  };

  return (
    <div className="fade-in">
      <h1 style={styles.title}>Admin Panel</h1>
      <p style={styles.subtitle}>Manage users, stocks and monitor platform activity</p>

      <div style={styles.tabBar}>
        {["overview", "users", "stocks"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && stats && (
        <>
          <div style={styles.statsRow}>
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Active Users" value={stats.activeUsers} />
            <StatCard label="Total Stocks" value={stats.totalStocks} />
            <StatCard label="Total Trades" value={stats.totalTrades} />
          </div>

          <div className="card" style={styles.tableCard}>
            <div style={styles.cardHeader}>Recent Trades</div>
            <div style={styles.tableHeader}>
              <span style={{ flex: 1.5 }}>User</span>
              <span style={{ flex: 1 }}>Type</span>
              <span style={{ flex: 1 }}>Stock</span>
              <span style={{ flex: 1, textAlign: "right" }}>Amount</span>
            </div>
            {recentTrades.map((t) => (
              <div key={t._id} style={styles.row}>
                <div style={{ flex: 1.5, fontSize: 12 }}>{t.user?.name}</div>
                <div style={{ flex: 1 }}>
                  <span className={t.type === "BUY" ? "badge badge-emerald" : "badge badge-red"}>{t.type}</span>
                </div>
                <div style={{ flex: 1, fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>{t.symbol}</div>
                <div style={{ flex: 1, textAlign: "right", fontSize: 12, fontWeight: 600 }}>${t.totalAmount?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "users" && (
        <div className="card" style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <span style={{ flex: 2 }}>Name</span>
            <span style={{ flex: 2 }}>Email</span>
            <span style={{ flex: 1, textAlign: "right" }}>Balance</span>
            <span style={{ flex: 1, textAlign: "right" }}>Status</span>
            <span style={{ flex: 1, textAlign: "right" }}>Action</span>
          </div>
          {users.map((u) => (
            <div key={u._id} style={styles.row}>
              <div style={{ flex: 2, fontSize: 12 }}>{u.name}</div>
              <div style={{ flex: 2, fontSize: 12, color: "var(--text-muted)" }}>{u.email}</div>
              <div style={{ flex: 1, textAlign: "right", fontSize: 12 }}>${u.balance?.toFixed(2)}</div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <span className={u.isActive ? "badge badge-emerald" : "badge badge-red"}>
                  {u.isActive ? "Active" : "Disabled"}
                </span>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <button className="btn-outline" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => handleToggleUser(u._id)}>
                  {u.isActive ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "stocks" && (
        <div className="card" style={styles.formCard}>
          <div style={styles.cardHeader}>Add New Stock</div>
          <form onSubmit={handleAddStock} style={styles.form}>
            <div style={styles.formRow}>
              <input className="input-field" placeholder="Symbol (e.g. AAPL)" value={stockForm.symbol}
                onChange={(e) => setStockForm({ ...stockForm, symbol: e.target.value.toUpperCase() })} required />
              <input className="input-field" placeholder="Company Name" value={stockForm.companyName}
                onChange={(e) => setStockForm({ ...stockForm, companyName: e.target.value })} required />
            </div>
            <div style={styles.formRow}>
              <input className="input-field" type="number" step="0.01" placeholder="Current Price"
                value={stockForm.currentPrice} onChange={(e) => setStockForm({ ...stockForm, currentPrice: e.target.value })} required />
              <input className="input-field" type="number" step="0.01" placeholder="Previous Close"
                value={stockForm.previousClose} onChange={(e) => setStockForm({ ...stockForm, previousClose: e.target.value })} />
            </div>
            <div style={styles.formRow}>
              <select className="input-field" value={stockForm.sector} onChange={(e) => setStockForm({ ...stockForm, sector: e.target.value })}>
                {["Technology", "Finance", "Healthcare", "Consumer", "Energy", "Communication", "Industrial", "Real Estate", "Materials", "Utilities", "Other"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select className="input-field" value={stockForm.exchange} onChange={(e) => setStockForm({ ...stockForm, exchange: e.target.value })}>
                <option value="NASDAQ">NASDAQ</option>
                <option value="NYSE">NYSE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>Add Stock</button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  title: { fontSize: 24, fontWeight: 700, color: "var(--text-primary)" },
  subtitle: { fontSize: 13, color: "var(--text-muted)", marginTop: 2, marginBottom: 20 },
  tabBar: { display: "flex", gap: 8, marginBottom: 16 },
  tab: { fontSize: 12, padding: "8px 16px", borderRadius: 8, background: "var(--bg-surface)", color: "var(--text-muted)", border: "0.5px solid var(--border)" },
  tabActive: { background: "var(--gold)", color: "var(--bg-base)", borderColor: "var(--gold)", fontWeight: 600 },
  statsRow: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  tableCard: { padding: 0, overflow: "hidden" },
  cardHeader: { padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", borderBottom: "0.5px solid var(--border)" },
  tableHeader: { display: "flex", padding: "10px 16px", borderBottom: "0.5px solid var(--border)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" },
  row: { display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "0.5px solid var(--bg-hover)" },
  formCard: { padding: 20, maxWidth: 600 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  formRow: { display: "flex", gap: 12 },
};

export default Admin;
