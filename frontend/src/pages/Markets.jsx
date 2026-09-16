import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStocks } from "../redux/slices/stockSlice";
import { fetchWatchlist } from "../redux/slices/watchlistSlice";
import { watchlistAPI } from "../api/endpoints";
import StockRow from "../components/common/StockRow";
import TradeModal from "../components/modals/TradeModal";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";

const SECTORS = ["All", "Technology", "Finance", "Healthcare", "Consumer", "Energy", "Communication", "Industrial", "Real Estate", "Materials"];

const Markets = () => {
  const dispatch = useDispatch();
  const { list: stocks, loading } = useSelector((state) => state.stocks);
  const { items: watchlist } = useSelector((state) => state.watchlist);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchStocks({
        search: search || undefined,
        sector: sector !== "All" ? sector : undefined,
        limit: 50,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, search, sector]);

  const watchedSymbols = new Set(watchlist.map((w) => w.symbol));

  const handleWatchToggle = async (symbol) => {
    try {
      if (watchedSymbols.has(symbol)) {
        await watchlistAPI.remove(symbol);
        toast.success(`${symbol} removed from watchlist`);
      } else {
        await watchlistAPI.add(symbol);
        toast.success(`${symbol} added to watchlist`);
      }
      dispatch(fetchWatchlist());
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="fade-in">
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Markets</h1>
          <p style={styles.subtitle}>{stocks.length} stocks available for trading</p>
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <FiSearch style={styles.searchIcon} size={15} />
          <input
            placeholder="Search by symbol or company name..."
            className="input-field"
            style={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.sectorTabs}>
          {SECTORS.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              style={{
                ...styles.sectorTab,
                ...(sector === s ? styles.sectorTabActive : {}),
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <span style={{ flex: 2 }}>Symbol</span>
          <span style={{ flex: 1, textAlign: "right" }}>Price</span>
          <span style={{ flex: 1, textAlign: "right" }}>Change</span>
          <span style={{ flex: 1, textAlign: "right" }}>Action</span>
        </div>
        {loading ? (
          <div style={styles.loadingBox}><div className="spinner" /></div>
        ) : stocks.length === 0 ? (
          <div style={styles.emptyBox}>No stocks found matching your criteria</div>
        ) : (
          stocks.map((stock) => (
            <StockRow
              key={stock.symbol}
              stock={stock}
              onBuyClick={setSelectedStock}
              showWatchAction
              isWatched={watchedSymbols.has(stock.symbol)}
              onWatchToggle={handleWatchToggle}
            />
          ))
        )}
      </div>

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={() => dispatch(fetchStocks({ limit: 50 }))}
        />
      )}
    </div>
  );
};

const styles = {
  headerRow: { marginBottom: 18 },
  title: { fontSize: 24, fontWeight: 700, color: "var(--text-primary)" },
  subtitle: { fontSize: 13, color: "var(--text-muted)", marginTop: 2 },
  filterBar: { marginBottom: 16 },
  searchBox: { position: "relative", marginBottom: 12 },
  searchIcon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" },
  searchInput: { paddingLeft: 38, maxWidth: 420 },
  sectorTabs: { display: "flex", gap: 6, flexWrap: "wrap" },
  sectorTab: {
    fontSize: 11, padding: "6px 13px", borderRadius: 20,
    background: "var(--bg-surface)", color: "var(--text-muted)", border: "0.5px solid var(--border)",
  },
  sectorTabActive: { background: "var(--gold)", color: "var(--bg-base)", borderColor: "var(--gold)", fontWeight: 600 },
  tableCard: { padding: 0, overflow: "hidden" },
  tableHeader: {
    display: "flex", padding: "10px 14px", borderBottom: "0.5px solid var(--border)",
    fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  loadingBox: { display: "flex", justifyContent: "center", padding: 40 },
  emptyBox: { textAlign: "center", padding: 40, fontSize: 13, color: "var(--text-muted)" },
};

export default Markets;
