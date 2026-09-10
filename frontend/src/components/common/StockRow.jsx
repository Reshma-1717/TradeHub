import React from "react";
import { useNavigate } from "react-router-dom";

const StockRow = ({ stock, onBuyClick, showWatchAction, onWatchToggle, isWatched }) => {
  const navigate = useNavigate();
  const isUp = stock.changePercent >= 0;

  return (
    <div style={styles.row} onClick={() => navigate(`/stocks/${stock.symbol}`)}>
      <div style={styles.symbolCol}>
        <div style={styles.symbol}>{stock.symbol}</div>
        <div style={styles.companyName}>{stock.companyName}</div>
      </div>
      <div style={styles.priceCol}>
        <div style={styles.price}>${stock.currentPrice?.toFixed(2)}</div>
      </div>
      <div style={styles.changeCol}>
        <span style={{ color: isUp ? "var(--emerald)" : "var(--red)", fontSize: 12 }}>
          {isUp ? "▲" : "▼"} {Math.abs(stock.changePercent || 0).toFixed(2)}%
        </span>
      </div>
      <div style={styles.actionCol} onClick={(e) => e.stopPropagation()}>
        {showWatchAction && (
          <button
            onClick={() => onWatchToggle(stock.symbol)}
            style={{ ...styles.watchBtn, color: isWatched ? "var(--gold)" : "var(--text-muted)" }}
          >
            {isWatched ? "★" : "☆"}
          </button>
        )}
        <button className="btn-buy" onClick={() => onBuyClick(stock)}>Buy</button>
      </div>
    </div>
  );
};

const styles = {
  row: {
    display: "flex", alignItems: "center", padding: "11px 14px",
    borderBottom: "0.5px solid var(--bg-hover)", cursor: "pointer",
    transition: "background 0.15s",
  },
  symbolCol: { flex: 2, minWidth: 0 },
  symbol: { fontSize: 12, fontWeight: 600, color: "var(--gold)" },
  companyName: { fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  priceCol: { flex: 1, textAlign: "right" },
  price: { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" },
  changeCol: { flex: 1, textAlign: "right" },
  actionCol: { flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 },
  watchBtn: { fontSize: 16, padding: 4 },
};

export default StockRow;
