const User        = require("../models/User");
const Stock       = require("../models/Stock");
const Transaction = require("../models/Transaction");
const Portfolio   = require("../models/Portfolio");

// ── GET /api/admin/stats ────────────────────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalStocks, totalTrades, activeUsers] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Stock.countDocuments({ isActive: true }),
      Transaction.countDocuments(),
      User.countDocuments({ isActive: true, role: "user" }),
    ]);

    const recentTrades = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .populate("stock", "symbol companyName");

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalStocks, totalTrades, activeUsers },
      recentTrades,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/users ────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: "user" };
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }];
    }

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page  : parseInt(page),
      pages : Math.ceil(total / parseInt(limit)),
      users,
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/admin/users/:id/toggle ────────────────────────────
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (user.role === "admin") return res.status(400).json({ success: false, message: "Cannot modify admin." });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully.`,
      isActive: user.isActive,
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/admin/users/:id/balance ───────────────────────────
exports.resetUserBalance = async (req, res, next) => {
  try {
    const { balance } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { balance: balance || 10000 },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    res.status(200).json({ success: true, message: "Balance reset.", user });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/transactions ─────────────────────────────────
exports.getAllTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const query = {};
    if (type) query.type = type.toUpperCase();

    const skip         = (parseInt(page) - 1) * parseInt(limit);
    const total        = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email")
      .populate("stock", "symbol companyName");

    res.status(200).json({ success: true, total, transactions });
  } catch (err) {
    next(err);
  }
};
