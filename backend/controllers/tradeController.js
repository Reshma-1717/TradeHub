const User        = require("../models/User");
const Stock       = require("../models/Stock");
const Portfolio   = require("../models/Portfolio");
const Transaction = require("../models/Transaction");

// ── POST /api/trade/buy ─────────────────────────────────────────
exports.buyStock = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Symbol and valid quantity are required." });
    }

    const qty = parseInt(quantity);

    // 1. Find stock
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found." });
    }

    // 2. Find user & check balance
    const user        = await User.findById(req.user.id);
    const totalCost   = parseFloat((stock.currentPrice * qty).toFixed(2));

    if (user.balance < totalCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. You need $${totalCost.toFixed(2)} but have $${user.balance.toFixed(2)}.`,
      });
    }

    // 3. Deduct balance
    user.balance = parseFloat((user.balance - totalCost).toFixed(2));
    await user.save({ validateBeforeSave: false });

    // 4. Update portfolio
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      portfolio = await Portfolio.create({ user: req.user.id, holdings: [] });
    }

    const existingHolding = portfolio.holdings.find(
      (h) => h.symbol === symbol.toUpperCase()
    );

    if (existingHolding) {
      // Update average buy price
      const totalShares    = existingHolding.quantity + qty;
      const totalCostBasis = existingHolding.avgBuyPrice * existingHolding.quantity + totalCost;
      existingHolding.avgBuyPrice  = parseFloat((totalCostBasis / totalShares).toFixed(4));
      existingHolding.quantity     = totalShares;
      existingHolding.totalInvested = parseFloat((totalShares * existingHolding.avgBuyPrice).toFixed(2));
    } else {
      portfolio.holdings.push({
        stock       : stock._id,
        symbol      : stock.symbol,
        quantity    : qty,
        avgBuyPrice : stock.currentPrice,
        totalInvested: totalCost,
      });
    }

    await portfolio.save();

    // 5. Record transaction
    const transaction = await Transaction.create({
      user        : req.user.id,
      stock       : stock._id,
      symbol      : stock.symbol,
      companyName : stock.companyName,
      type        : "BUY",
      quantity    : qty,
      price       : stock.currentPrice,
      totalAmount : totalCost,
      balanceAfter: user.balance,
    });

    res.status(200).json({
      success: true,
      message: `Successfully bought ${qty} share(s) of ${stock.symbol} at $${stock.currentPrice}`,
      transaction,
      newBalance: user.balance,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/trade/sell ────────────────────────────────────────
exports.sellStock = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Symbol and valid quantity are required." });
    }

    const qty = parseInt(quantity);

    // 1. Find stock
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found." });
    }

    // 2. Check portfolio
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      return res.status(400).json({ success: false, message: "You have no portfolio." });
    }

    const holding = portfolio.holdings.find((h) => h.symbol === symbol.toUpperCase());
    if (!holding || holding.quantity < qty) {
      return res.status(400).json({
        success: false,
        message: `You only own ${holding ? holding.quantity : 0} share(s) of ${symbol.toUpperCase()}.`,
      });
    }

    // 3. Calculate proceeds and P&L
    const totalProceeds = parseFloat((stock.currentPrice * qty).toFixed(2));
    const costBasis     = parseFloat((holding.avgBuyPrice * qty).toFixed(2));
    const realizedPnL   = parseFloat((totalProceeds - costBasis).toFixed(2));

    // 4. Update user balance
    const user   = await User.findById(req.user.id);
    user.balance = parseFloat((user.balance + totalProceeds).toFixed(2));
    await user.save({ validateBeforeSave: false });

    // 5. Update holding
    holding.quantity -= qty;
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter((h) => h.symbol !== symbol.toUpperCase());
    } else {
      holding.totalInvested = parseFloat((holding.quantity * holding.avgBuyPrice).toFixed(2));
    }
    await portfolio.save();

    // 6. Record transaction
    const transaction = await Transaction.create({
      user        : req.user.id,
      stock       : stock._id,
      symbol      : stock.symbol,
      companyName : stock.companyName,
      type        : "SELL",
      quantity    : qty,
      price       : stock.currentPrice,
      totalAmount : totalProceeds,
      balanceAfter: user.balance,
      realizedPnL,
    });

    res.status(200).json({
      success: true,
      message: `Successfully sold ${qty} share(s) of ${stock.symbol} at $${stock.currentPrice}`,
      transaction,
      realizedPnL,
      newBalance: user.balance,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/trade/history ──────────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const query = { user: req.user.id };
    if (type) query.type = type.toUpperCase();

    const skip         = (parseInt(page) - 1) * parseInt(limit);
    const total        = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("stock", "symbol companyName sector");

    res.status(200).json({
      success: true,
      total,
      page  : parseInt(page),
      pages : Math.ceil(total / parseInt(limit)),
      transactions,
    });
  } catch (err) {
    next(err);
  }
};
