const Stock = require("../models/Stock");

// ── GET /api/stocks ─────────────────────────────────────────────
exports.getAllStocks = async (req, res, next) => {
  try {
    const { sector, search, sort = "symbol", page = 1, limit = 20 } = req.query;

    const query = { isActive: true };
    if (sector) query.sector = sector;
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ symbol: regex }, { companyName: regex }];
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Stock.countDocuments(query);

    const stocks = await Stock.find(query)
      .select("-priceHistory -__v")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count  : stocks.length,
      total,
      page   : parseInt(page),
      pages  : Math.ceil(total / parseInt(limit)),
      stocks,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/stocks/:symbol ─────────────────────────────────────
exports.getStockBySymbol = async (req, res, next) => {
  try {
    const stock = await Stock.findOne({
      symbol  : req.params.symbol.toUpperCase(),
      isActive: true,
    });

    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found." });
    }

    res.status(200).json({ success: true, stock });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/stocks — Admin only ──────────────────────────────
exports.createStock = async (req, res, next) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json({ success: true, stock });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/stocks/:id — Admin only ───────────────────────────
exports.updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new          : true,
      runValidators: true,
    });
    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found." });
    }
    res.status(200).json({ success: true, stock });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/stocks/:id — Admin only (soft delete) ──────────
exports.deleteStock = async (req, res, next) => {
  try {
    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found." });
    }
    res.status(200).json({ success: true, message: "Stock removed from listings." });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/stocks/top/movers ──────────────────────────────────
exports.getTopMovers = async (req, res, next) => {
  try {
    const gainers = await Stock.find({ isActive: true, changePercent: { $gt: 0 } })
      .sort({ changePercent: -1 })
      .limit(5)
      .select("symbol companyName currentPrice change changePercent");

    const losers = await Stock.find({ isActive: true, changePercent: { $lt: 0 } })
      .sort({ changePercent: 1 })
      .limit(5)
      .select("symbol companyName currentPrice change changePercent");

    res.status(200).json({ success: true, gainers, losers });
  } catch (err) {
    next(err);
  }
};
