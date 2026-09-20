import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { tradeAPI } from "../../api/endpoints";
import { updateBalance } from "../../redux/slices/authSlice";
import { FiX } from "react-icons/fi";

const TradeModal = ({ stock, onClose, onSuccess }) => {
  const [type, setType] = useState("BUY");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const total = (stock.currentPrice * quantity).toFixed(2);

  const handleSubmit = async () => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    setLoading(true);
    try {
      const apiCall = type === "BUY" ? tradeAPI.buy : tradeAPI.sell;
      const res = await apiCall({ symbol: stock.symbol, quantity: parseInt(quantity) });

      toast.success(res.data.message);
      dispatch(updateBalance(res.data.newBalance));
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()} className="fade-in">
        <div style={styles.header}>
          <div>
            <div style={styles.symbol}>{stock.symbol}</div>
            <div style={styles.companyName}>{stock.companyName}</div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}><FiX size={18} /></button>
        </div>

        <div style={styles.priceRow}>
          <span style={styles.priceLabel}>Current Price</span>
          <span style={styles.priceValue}>${stock.currentPrice?.toFixed(2)}</span>
        </div>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(type === "BUY" ? styles.tabBuyActive : {}) }}
            onClick={() => setType("BUY")}
          >
            Buy
          </button>
          <button
            style={{ ...styles.tab, ...(type === "SELL" ? styles.tabSellActive : {}) }}
            onClick={() => setType("SELL")}
          >
            Sell
          </button>
        </div>

        <label style={styles.label}>Quantity</label>
        <input
          type="number"
          min="1"
          className="input-field"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={styles.qtyInput}
        />

        <div style={styles.summary}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Estimated Total</span>
            <span style={styles.summaryValue}>${total}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...styles.confirmBtn,
            background: type === "BUY" ? "var(--emerald)" : "var(--red)",
          }}
        >
          {loading ? "Processing..." : `Confirm ${type === "BUY" ? "Purchase" : "Sale"}`}
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, backdropFilter: "blur(4px)",
  },
  modal: {
    background: "var(--bg-elevated)", border: "0.5px solid var(--border)",
    borderRadius: 16, padding: 24, width: "100%", maxWidth: 360,
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  symbol: { fontSize: 18, fontWeight: 700, color: "var(--gold)" },
  companyName: { fontSize: 12, color: "var(--text-muted)", marginTop: 2 },
  closeBtn: { color: "var(--text-muted)", padding: 4 },
  priceRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 14px", background: "var(--bg-surface)", borderRadius: 10, marginBottom: 16,
  },
  priceLabel: { fontSize: 12, color: "var(--text-muted)" },
  priceValue: { fontSize: 16, fontWeight: 600, color: "var(--text-primary)" },
  tabs: { display: "flex", gap: 8, marginBottom: 16 },
  tab: {
    flex: 1, padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 500,
    background: "var(--bg-surface)", color: "var(--text-muted)", border: "0.5px solid var(--border)",
  },
  tabBuyActive: { background: "var(--emerald-dim)", color: "var(--emerald)", border: "0.5px solid var(--emerald)" },
  tabSellActive: { background: "var(--red-dim)", color: "var(--red)", border: "0.5px solid var(--red)" },
  label: { fontSize: 11, color: "var(--text-muted)", marginBottom: 6, display: "block" },
  qtyInput: { marginBottom: 16, textAlign: "center", fontSize: 16, fontWeight: 600 },
  summary: {
    background: "var(--bg-surface)", borderRadius: 10, padding: "12px 14px", marginBottom: 18,
  },
  summaryRow: { display: "flex", justifyContent: "space-between" },
  summaryLabel: { fontSize: 12, color: "var(--text-muted)" },
  summaryValue: { fontSize: 16, fontWeight: 700, color: "var(--gold)" },
  confirmBtn: {
    width: "100%", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 600,
    color: "var(--bg-base)",
  },
};

export default TradeModal;
