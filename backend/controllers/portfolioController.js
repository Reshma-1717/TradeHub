const Portfolio   = require("../models/Portfolio");
const Transaction = require("../models/Transaction");
const Stock       = require("../models/Stock");

// ── GET /api/portfolio ──────────────────────────────────────────
exports.getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id })
      .populate("holdings.stock", "symbol companyName currentPrice change changePercent sector");

    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found." });
    }

    // Build enriched holdings with live P&L
    const enrichedHoldings = portfolio.holdings.map((h) => {
      const livePrice    = h.stock?.currentPrice || h.avgBuyPrice;
      const currentValue = parseFloat((livePrice * h.quantity).toFixed(2));
      const invested     = parseFloat((h.avgBuyPrice * h.quantity).toFixed(2));
      const pnl          = parseFloat((currentValue - invested).toFixed(2));
      const pnlPercent   = invested > 0
        ? parseFloat(((pnl / invested) * 100).toFixed(2))
        : 0;

      return {
        symbol      : h.symbol,
        companyName : h.stock?.companyName || "",
        sector      : h.stock?.sector || "",
        quantity    : h.quantity,
        avgBuyPrice : h.avgBuyPrice,
        currentPrice: livePrice,
        currentValue,
        invested,
        pnl,
        pnlPercent,
        change      : h.stock?.change || 0,
        changePercent: h.stock?.changePercent || 0,
      };
    });

    // Overall totals
    const totalInvested  = enrichedHoldings.reduce((s, h) => s + h.invested, 0);
    const currentValue   = enrichedHoldings.reduce((s, h) => s + h.currentValue, 0);
    const totalPnL       = parseFloat((currentValue - totalInvested).toFixed(2));
    const totalPnLPercent = totalInvested > 0
      ? parseFloat(((totalPnL / totalInvested) * 100).toFixed(2))
      : 0;

    res.status(200).json({
      success: true,
      portfolio: {
        holdings     : enrichedHoldings,
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        currentValue : parseFloat(currentValue.toFixed(2)),
        totalPnL,
        totalPnLPercent,
        holdingsCount: enrichedHoldings.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/portfolio/summary ──────────────────────────────────
exports.getSummary = async (req, res, next) => {
  try {
    const portfolio    = await Portfolio.findOne({ user: req.user.id });
    const totalTrades  = await Transaction.countDocuments({ user: req.user.id });
    const totalBuys    = await Transaction.countDocuments({ user: req.user.id, type: "BUY" });
    const totalSells   = await Transaction.countDocuments({ user: req.user.id, type: "SELL" });

    const sellTxns     = await Transaction.find({ user: req.user.id, type: "SELL" });
    const realizedPnL  = sellTxns.reduce((s, t) => s + (t.realizedPnL || 0), 0);

    res.status(200).json({
      success: true,
      summary: {
        totalTrades,
        totalBuys,
        totalSells,
        realizedPnL   : parseFloat(realizedPnL.toFixed(2)),
        holdingsCount : portfolio?.holdings?.length || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
