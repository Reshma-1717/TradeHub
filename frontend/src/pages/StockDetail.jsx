import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { stockAPI, watchlistAPI } from "../api/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { fetchWatchlist } from "../redux/slices/watchlistSlice";
import StockChart from "../components/charts/StockChart";
import TradeModal from "../components/modals/TradeModal";
import { toast } from "react-toastify";
import { FiArrowLeft, FiStar } from "react-icons/fi";

const RANGES = ["1D", "1M", "3M", "6M", "1Y"];

// Generate mock historical data around the current price for chart visualization
const generateHistory = (currentPrice, range) => {
  const points = { "1D": 24, "1M": 30, "3M": 12, "6M": 26, "1Y": 12 }[range] || 24;
  const labelFmt = {
    "1D": (i) => `${9 + Math.floor(i / 4)}:${(i % 4) * 15 || "00"}`,
    "1M": (i) => `Day ${i + 1}`,
    "3M": (i) => `Wk ${i + 1}`,
    "6M": (i) => `Wk ${i + 1}`,
    "1Y": (i) => `Mo ${i + 1}`,
  }[range];

  let price = currentPrice * 0.94;
  const data = [];
  const labels = [];
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.45) * (currentPrice * 0.015);
    data.push(parseFloat(price.toFixed(2)));
    labels.push(labelFmt(i));
  }
  data[data.length - 1] = currentPrice;
  return { labels, data };
};

const StockDetail = () => {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const { items: watchlist } = useSelector((state) => state.watchlist);
  const [stock, setStock] = useState(null);
  const [range, setRange] = useState("1D");
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const isWatched = watchlist.some((w) => w.symbol === symbol);

  const loadStock = useCallback(async () => {
    try {
      const res = await stockAPI.getBySymbol(symbol);
      setStock(res.data.stock);
      setChartData(generateHistory(res.data.stock.currentPrice, range));
    } catch (err) {
      toast.error("Stock not found");
    } finally {
      setLoading(false);
    }
  }, [symbol, range]);

  useEffect(() => { loadStock(); }, [loadStock]);
  useEffect(() => { dispatch(fetchWatchlist()); }, [dispatch]);

  const handleWatchToggle = async () => {
    try {
      if (isWatched) {
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

  if (loading) return <div style={styles.loadingBox}><div className="spinner" /></div>;
  if (!stock) return <div style={styles.emptyBox}>Stock not found</div>;

  const isUp = stock.changePercent >= 0;

  return (
    <div className="fade-in">
      <Link to="/markets" style={styles.backLink}><FiArrowLeft size={13} /> Back to Markets</Link>

      <div style={styles.headerRow}>
        <div>
          <div style={styles.symbolRow}>
            <h1 style={styles.symbol}>{stock.symbol}</h1>
            <span className="badge badge-gold">{stock.sector}</span>
            <span className="badge badge-violet">{stock.exchange}</span>
          </div>
          <p style={styles.companyName}>{stock.companyName}</p>
        </div>
        <button onClick={handleWatchToggle} style={styles.watchBtn}>
          <FiStar size={15} fill={isWatched ? "var(--gold)" : "none"} color={isWatched ? "var(--gold)" : "var(--text-muted)"} />
          {isWatched ? "Watching" : "Add to Watchlist"}
        </button>
      </div>

      <div style={styles.priceRow}>
        <span style={styles.price}>${stock.currentPrice?.toFixed(2)}</span>
        <span style={{ color: isUp ? "var(--emerald)" : "var(--red)", fontSize: 15, fontWeight: 600 }}>
          {isUp ? "▲" : "▼"} {stock.change?.toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
        </span>
      </div>

      <div style={styles.bodyGrid}>
        <div className="card" style={styles.chartCard}>
          <div style={styles.rangeTabs}>
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{ ...styles.rangeTab, ...(range === r ? styles.rangeTabActive : {}) }}
              >
                {r}
              </button>
            ))}
          </div>
          <StockChart labels={chartData.labels} data={chartData.data} positive={isUp} height={280} />

          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Open</div>
              <div style={styles.statVal}>${stock.openPrice?.toFixed(2)}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>High</div>
              <div style={styles.statVal}>${stock.highPrice?.toFixed(2)}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Low</div>
              <div style={styles.statVal}>${stock.lowPrice?.toFixed(2)}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Volume</div>
              <div style={styles.statVal}>{(stock.volume / 1e6).toFixed(1)}M</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Market Cap</div>
              <div style={styles.statVal}>${(stock.marketCap / 1e9).toFixed(1)}B</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Prev Close</div>
              <div style={styles.statVal}>${stock.previousClose?.toFixed(2)}</div>
            </div>
          </div>

          {stock.description && (
            <div style={styles.descBox}>
              <div style={styles.descTitle}>About {stock.companyName}</div>
              <p style={styles.descText}>{stock.description}</p>
            </div>
          )}
        </div>

        <div style={styles.sidebar}>
          <div className="card" style={styles.tradeCard}>
            <div style={styles.tradeCardTitle}>Trade {stock.symbol}</div>
            <p style={styles.tradeCardSub}>Buy or sell shares at the current market price</p>
            <button className="btn-primary" style={styles.tradeBtnPrimary} onClick={() => setShowModal(true)}>
              ◆ Trade Now
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <TradeModal
          stock={stock}
          onClose={() => setShowModal(false)}
          onSuccess={loadStock}
        />
      )}
    </div>
  );
};

const styles = {
  backLink: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", marginBottom: 16 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  symbolRow: { display: "flex", alignItems: "center", gap: 10 },
  symbol: { fontSize: 26, fontWeight: 700, color: "var(--gold)" },
  companyName: { fontSize: 13, color: "var(--text-muted)", marginTop: 2 },
  watchBtn: {
    display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)",
    border: "0.5px solid var(--border)", borderRadius: 8, padding: "8px 14px",
  },
  priceRow: { display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20 },
  price: { fontSize: 32, fontWeight: 700, color: "var(--text-primary)" },
  bodyGrid: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 },
  chartCard: { padding: 18 },
  rangeTabs: { display: "flex", gap: 6, marginBottom: 14 },
  rangeTab: { fontSize: 11, padding: "6px 14px", borderRadius: 7, background: "var(--bg-base)", color: "var(--text-muted)", border: "0.5px solid var(--border)" },
  rangeTabActive: { background: "var(--gold)", color: "var(--bg-base)", borderColor: "var(--gold)", fontWeight: 600 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 20, paddingTop: 20, borderTop: "0.5px solid var(--border)" },
  statItem: {},
  statLabel: { fontSize: 10, color: "var(--text-muted)", marginBottom: 4 },
  statVal: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)" },
  descBox: { marginTop: 20, paddingTop: 20, borderTop: "0.5px solid var(--border)" },
  descTitle: { fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 },
  descText: { fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 },
  sidebar: {},
  tradeCard: { padding: 18 },
  tradeCardTitle: { fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 },
  tradeCardSub: { fontSize: 11, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 },
  tradeBtnPrimary: { width: "100%", padding: 12 },
  loadingBox: { display: "flex", justifyContent: "center", padding: 60 },
  emptyBox: { textAlign: "center", padding: 60, color: "var(--text-muted)" },
};

export default StockDetail;
