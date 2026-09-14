import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStocks, fetchTopMovers } from "../redux/slices/stockSlice";
import { fetchPortfolio } from "../redux/slices/portfolioSlice";
import StatCard from "../components/common/StatCard";
import StockRow from "../components/common/StockRow";
import TradeModal from "../components/modals/TradeModal";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: stocks, gainers } = useSelector((state) => state.stocks);
  const portfolio = useSelector((state) => state.portfolio);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    dispatch(fetchStocks({ limit: 20 }));
    dispatch(fetchTopMovers());
    dispatch(fetchPortfolio());
  }, [dispatch]);

  const refreshData = () => {
    dispatch(fetchPortfolio());
    dispatch(fetchStocks({ limit: 6 }));
  };

  const totalAccountValue = (user?.balance || 0) + (portfolio.currentValue || 0);

  return (
    <div className="fade-in">
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome back, {user?.name?.split(" ")[0]}</p>
        </div>
        <span className="badge badge-emerald">● Markets Open</span>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <StatCard
          label="Total Account Value"
          value={`$${totalAccountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={portfolio.totalPnL !== 0 ? `${portfolio.totalPnL >= 0 ? "▲" : "▼"} ${portfolio.totalPnLPercent}% overall` : null}
          changeColor={portfolio.totalPnL >= 0 ? "var(--emerald)" : "var(--red)"}
        />
        <StatCard
          label="Virtual Cash"
          value={`$${(user?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="Available to trade"
        />
        <StatCard
          label="Portfolio Value"
          value={`$${(portfolio.currentValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub={`${portfolio.holdingsCount || 0} positions`}
        />
        <StatCard
          label="Total P&L"
          value={`${portfolio.totalPnL >= 0 ? "+" : ""}$${Math.abs(portfolio.totalPnL || 0).toFixed(2)}`}
          change={portfolio.totalPnL !== 0 ? `${portfolio.totalPnL >= 0 ? "▲" : "▼"} ${Math.abs(portfolio.totalPnLPercent || 0)}%` : "No trades yet"}
          changeColor={portfolio.totalPnL >= 0 ? "var(--emerald)" : "var(--red)"}
        />
      </div>

      <div style={styles.bodyGrid}>
        {/* Main content */}
        <div>
          <div className="card" style={styles.tableCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Markets Overview</span>
              <Link to="/markets" style={styles.viewAll}>View all →</Link>
            </div>
            {stocks.map((stock) => (
              <StockRow
                key={stock.symbol}
                stock={stock}
                onBuyClick={setSelectedStock}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div className="card" style={styles.sideCard}>
            <div style={styles.cardTitleSmall}>Top Gainers Today</div>
            {gainers?.length > 0 ? gainers.slice(0, 5).map((g) => (
              <div key={g.symbol} style={styles.gainerRow}>
                <span style={styles.gainerSym}>{g.symbol}</span>
                <span style={styles.gainerChg}>▲ {g.changePercent?.toFixed(2)}%</span>
              </div>
            )) : (
              <p style={styles.emptyText}>No data yet</p>
            )}
          </div>

          {portfolio.holdings?.length > 0 && (
            <div className="card" style={styles.sideCard}>
              <div style={styles.cardTitleSmall}>My Holdings</div>
              {portfolio.holdings.slice(0, 5).map((h) => (
                <div key={h.symbol} style={styles.holdRow}>
                  <div>
                    <div style={styles.holdSym}>{h.symbol}</div>
                    <div style={styles.holdQty}>{h.quantity} shares</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.holdVal}>${h.currentValue.toFixed(0)}</div>
                    <div style={{ fontSize: 10, color: h.pnl >= 0 ? "var(--emerald)" : "var(--red)" }}>
                      {h.pnl >= 0 ? "+" : ""}${h.pnl.toFixed(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
};

const styles = {
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 700, color: "var(--text-primary)" },
  subtitle: { fontSize: 13, color: "var(--text-muted)", marginTop: 2 },
  statsRow: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  bodyGrid: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 },
  tableCard: { padding: 0, overflow: "hidden" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "0.5px solid var(--border)" },
  cardTitle: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" },
  cardTitleSmall: { fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 },
  viewAll: { fontSize: 11, color: "var(--gold)" },
  sidebar: { display: "flex", flexDirection: "column", gap: 14 },
  sideCard: { padding: 14 },
  gainerRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid var(--bg-hover)" },
  gainerSym: { fontSize: 12, fontWeight: 600, color: "var(--gold)" },
  gainerChg: { fontSize: 11, color: "var(--emerald)" },
  holdRow: { display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "0.5px solid var(--bg-hover)" },
  holdSym: { fontSize: 11, fontWeight: 600, color: "var(--gold)" },
  holdQty: { fontSize: 10, color: "var(--text-muted)" },
  holdVal: { fontSize: 11, fontWeight: 600, color: "var(--text-primary)" },
  emptyText: { fontSize: 11, color: "var(--text-muted)" },
};

export default Dashboard;
