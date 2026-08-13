const Watchlist = require("../models/Watchlist");
const Stock     = require("../models/Stock");

// ── GET /api/watchlist ──────────────────────────────────────────
exports.getWatchlist = async (req, res, next) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user.id })
      .populate("stocks.stock", "symbol companyName currentPrice change changePercent sector");

    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user.id, stocks: [] });
    }

    const enriched = watchlist.stocks.map((item) => ({
      symbol       : item.symbol,
      companyName  : item.stock?.companyName || "",
      currentPrice : item.stock?.currentPrice || 0,
      change       : item.stock?.change || 0,
      changePercent: item.stock?.changePercent || 0,
      sector       : item.stock?.sector || "",
      addedAt      : item.addedAt,
    }));

    res.status(200).json({ success: true, watchlist: enriched });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/watchlist/add ─────────────────────────────────────
exports.addToWatchlist = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ success: false, message: "Symbol is required." });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found." });
    }

    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user.id, stocks: [] });
    }

    const alreadyAdded = watchlist.stocks.find((s) => s.symbol === symbol.toUpperCase());
    if (alreadyAdded) {
      return res.status(400).json({ success: false, message: "Stock already in watchlist." });
    }

    if (watchlist.stocks.length >= 30) {
      return res.status(400).json({ success: false, message: "Watchlist limit is 30 stocks." });
    }

    watchlist.stocks.push({ stock: stock._id, symbol: stock.symbol });
    await watchlist.save();

    res.status(200).json({ success: true, message: `${stock.symbol} added to watchlist.` });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/watchlist/remove/:symbol ────────────────────────
exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const symbol    = req.params.symbol.toUpperCase();
    const watchlist = await Watchlist.findOne({ user: req.user.id });

    if (!watchlist) {
      return res.status(404).json({ success: false, message: "Watchlist not found." });
    }

    watchlist.stocks = watchlist.stocks.filter((s) => s.symbol !== symbol);
    await watchlist.save();

    res.status(200).json({ success: true, message: `${symbol} removed from watchlist.` });
  } catch (err) {
    next(err);
  }
};
