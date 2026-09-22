import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolio } from "../redux/slices/portfolioSlice";
import { tradeAPI } from "../api/endpoints";
import StatCard from "../components/common/StatCard";
import TradeModal from "../components/modals/TradeModal";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const portfolio = useSelector((state) => state.portfolio);
  const [selectedStock, setSelectedStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("holdings");

  useEffect(() => {
    dispatch(fetchPortfolio());
    loadHistory();
  }, [dispatch]);

  const loadHistory = async () => {
    try {
      const res = await tradeAPI.getHistory({ limit: 30 });
      setHistory(res.data.transactions);
    } catch (err) {
      console.error(err);
    }
  };

  const refresh = () => {
    dispatch(fetchPortfolio());
    loadHistory();
  };

  return (
    <div className="fade-in">
      <h1 style={styles.title}>Portfolio</h1>
      <p style={styles.subtitle}>Track your holdings and transaction history</p>

      <div style={styles.statsRow}>
        <StatCard label="Total Invested" value={`$${(portfolio.totalInvested || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
        <StatCard label="Current Value" value={`$${(portfolio.currentValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
        <StatCard
          label="Total P&L"
          value={`${portfolio.totalPnL >= 0 ? "+" : ""}$${Math.abs(portfolio.totalPnL || 0).toFixed(2)}`}
          change={`${portfolio.totalPnL >= 0 ? "▲" : "▼"} ${Math.abs(portfolio.totalPnLPercent || 0)}%`}
          changeColor={portfolio.totalPnL >= 0 ? "var(--emerald)" : "var(--red)"}
        />
        <StatCard label="Open Positions" value={portfolio.holdingsCount || 0} />
      </div>

      <div style={styles.tabBar}>
        <button onClick={() => setTab("holdings")} style={{ ...styles.tab, ...(tab === "holdings" ? styles.tabActive : {}) }}>Holdings</button>
        <button onClick={() => setTab("history")} style={{ ...styles.tab, ...(tab === "history" ? styles.tabActive : {}) }}>Transaction History</button>
      </div>

      {tab === "holdings" ? (
        <div className="card" style={styles.tableCard}>
          {portfolio.holdings?.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>You don't own any stocks yet.</p>
              <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => navigate("/markets")}>
                Browse Markets
              </button>
            </div>
          ) : (
            <>
              <div style={styles.tableHeader}>
                <span style={{ flex: 2 }}>Stock</span>
                <span style={{ flex: 1, textAlign: "right" }}>Qty</span>
                <span style={{ flex: 1, textAlign: "right" }}>Avg Cost</span>
                <span style={{ flex: 1, textAlign: "right" }}>Current</span>
                <span style={{ flex: 1, textAlign: "right" }}>Value</span>
                <span style={{ flex: 1, textAlign: "right" }}>P&L</span>
                <span style={{ flex: 1, textAlign: "right" }}>Action</span>
              </div>
              {portfolio.holdings.map((h) => (
                <div key={h.symbol} style={styles.holdingRow}>
                  <div style={{ flex: 2 }}>
                    <div style={styles.hSymbol}>{h.symbol}</div>
                    <div style={styles.hName}>{h.companyName}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 12 }}>{h.quantity}</div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 12 }}>${h.avgBuyPrice.toFixed(2)}</div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 12 }}>${h.currentPrice.toFixed(2)}</div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 12, fontWeight: 600 }}>${h.currentValue.toFixed(2)}</div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <span style={{ fontSize: 11, color: h.pnl >= 0 ? "var(--emerald)" : "var(--red)" }}>
                      {h.pnl >= 0 ? "+" : ""}${h.pnl.toFixed(2)} ({h.pnlPercent}%)
                    </span>
                  </div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <button
                      className="btn-sell"
                      onClick={() => setSelectedStock({ symbol: h.symbol, companyName: h.companyName, currentPrice: h.currentPrice })}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="card" style={styles.tableCard}>
          {history.length === 0 ? (
            <div style={styles.emptyBox}>No transactions yet.</div>
          ) : (
            <>
              <div style={styles.tableHeader}>
                <span style={{ flex: 1 }}>Type</span>
                <span style={{ flex: 2 }}>Stock</span>
                <span style={{ flex: 1, textAlign: "right" }}>Qty</span>
                <span style={{ flex: 1, textAlign: "right" }}>Price</span>
                <span style={{ flex: 1, textAlign: "right" }}>Total</span>
                <span style={{ flex: 1, textAlign: "right" }}>Date</span>
              </div>
              {history.map((t) => (
                <div key={t._id} style={styles.holdingRow}>
                  <div style={{ flex: 1 }}>
                    <span className={t.type === "BUY" ? "badge badge-emerald" : "badge badge-red"}>{t.type}</span>
                  </div>
                  <div style={{ flex: 2, fontSize: 12, fontWeight: 600, color: "var(--gold)" }}>{t.symbol}</div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 12 }}>{t.quantity}</div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 12 }}>${t.price.toFixed(2)}</div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 12, fontWeight: 600 }}>${t.totalAmount.toFixed(2)}</div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 11, color: "var(--text-muted)" }}>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {selectedStock && (
        <TradeModal stock={selectedStock} onClose={() => setSelectedStock(null)} onSuccess={refresh} />
      )}
    </div>
  );
};

const styles = {
  title: { fontSize: 24, fontWeight: 700, color: "var(--text-primary)" },
  subtitle: { fontSize: 13, color: "var(--text-muted)", marginTop: 2, marginBottom: 20 },
  statsRow: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  tabBar: { display: "flex", gap: 8, marginBottom: 14 },
  tab: { fontSize: 12, padding: "8px 16px", borderRadius: 8, background: "var(--bg-surface)", color: "var(--text-muted)", border: "0.5px solid var(--border)" },
  tabActive: { background: "var(--gold)", color: "var(--bg-base)", borderColor: "var(--gold)", fontWeight: 600 },
  tableCard: { padding: 0, overflow: "hidden" },
  tableHeader: { display: "flex", padding: "10px 16px", borderBottom: "0.5px solid var(--border)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" },
  holdingRow: { display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "0.5px solid var(--bg-hover)" },
  hSymbol: { fontSize: 12, fontWeight: 600, color: "var(--gold)" },
  hName: { fontSize: 10, color: "var(--text-muted)" },
  emptyBox: { textAlign: "center", padding: 50, color: "var(--text-muted)", fontSize: 13 },
};

export default Portfolio;
