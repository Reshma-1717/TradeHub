import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchlist } from "../redux/slices/watchlistSlice";
import { watchlistAPI } from "../api/endpoints";
import TradeModal from "../components/modals/TradeModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

const WatchlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.watchlist);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => { dispatch(fetchWatchlist()); }, [dispatch]);

  const handleRemove = async (symbol) => {
    try {
      await watchlistAPI.remove(symbol);
      toast.success(`${symbol} removed from watchlist`);
      dispatch(fetchWatchlist());
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="fade-in">
      <h1 style={styles.title}>Watchlist</h1>
      <p style={styles.subtitle}>{items.length} stocks you're tracking</p>

      <div className="card" style={styles.tableCard}>
        {loading ? (
          <div style={styles.emptyBox}><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div style={styles.emptyBox}>
            <p>Your watchlist is empty.</p>
            <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => navigate("/markets")}>
              Browse Markets
            </button>
          </div>
        ) : (
          <>
            <div style={styles.tableHeader}>
              <span style={{ flex: 2 }}>Stock</span>
              <span style={{ flex: 1, textAlign: "right" }}>Price</span>
              <span style={{ flex: 1, textAlign: "right" }}>Change</span>
              <span style={{ flex: 1.5, textAlign: "right" }}>Action</span>
            </div>
            {items.map((item) => {
              const isUp = item.changePercent >= 0;
              return (
                <div key={item.symbol} style={styles.row}>
                  <div style={{ flex: 2 }}>
                    <div style={styles.symbol}>{item.symbol}</div>
                    <div style={styles.companyName}>{item.companyName}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "right", fontSize: 13, fontWeight: 600 }}>
                    ${item.currentPrice?.toFixed(2)}
                  </div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <span style={{ color: isUp ? "var(--emerald)" : "var(--red)", fontSize: 12 }}>
                      {isUp ? "▲" : "▼"} {Math.abs(item.changePercent || 0).toFixed(2)}%
                    </span>
                  </div>
                  <div style={{ flex: 1.5, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button
                      className="btn-buy"
                      onClick={() => setSelectedStock({
                        symbol: item.symbol,
                        companyName: item.companyName,
                        currentPrice: item.currentPrice,
                      })}
                    >
                      Buy
                    </button>
                    <button style={styles.removeBtn} onClick={() => handleRemove(item.symbol)}>
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={() => dispatch(fetchWatchlist())}
        />
      )}
    </div>
  );
};

const styles = {
  title: { fontSize: 24, fontWeight: 700, color: "var(--text-primary)" },
  subtitle: { fontSize: 13, color: "var(--text-muted)", marginTop: 2, marginBottom: 20 },
  tableCard: { padding: 0, overflow: "hidden" },
  tableHeader: { display: "flex", padding: "10px 16px", borderBottom: "0.5px solid var(--border)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase" },
  row: { display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "0.5px solid var(--bg-hover)" },
  symbol: { fontSize: 12, fontWeight: 600, color: "var(--gold)" },
  companyName: { fontSize: 10, color: "var(--text-muted)" },
  removeBtn: { color: "var(--red)", padding: "6px 8px", border: "0.5px solid var(--border)", borderRadius: 6 },
  emptyBox: { textAlign: "center", padding: 50, color: "var(--text-muted)", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center" },
};

export default WatchlistPage;
