const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    stock: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : "Stock",
      required : true,
    },
    symbol: {
      type     : String,
      required : true,
      uppercase: true,
    },
    quantity: {
      type    : Number,
      required: true,
      min     : [0, "Quantity cannot be negative"],
    },
    avgBuyPrice: {
      type    : Number,
      required: true,
      min     : [0, "Avg buy price cannot be negative"],
    },
    totalInvested: {
      type    : Number,
      default : 0,
    },
  },
  { _id: true }
);

// Compute totalInvested before saving holding
holdingSchema.pre("save", function (next) {
  this.totalInvested = parseFloat((this.quantity * this.avgBuyPrice).toFixed(2));
  next();
});

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : "User",
      required : true,
      unique   : true,
    },
    holdings: [holdingSchema],

    // Snapshot totals — updated on every trade
    totalInvested: {
      type    : Number,
      default : 0,
    },
    currentValue: {
      type    : Number,
      default : 0,
    },
    totalPnL: {
      type    : Number,
      default : 0,
    },
    totalPnLPercent: {
      type    : Number,
      default : 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ─────────────────────────────────────────────────────
portfolioSchema.index({ user: 1 });

// ── Method: Recalculate portfolio totals ────────────────────────
portfolioSchema.methods.recalculate = function (stockPrices = {}) {
  let totalInvested = 0;
  let currentValue  = 0;

  this.holdings = this.holdings.filter((h) => h.quantity > 0);

  for (const holding of this.holdings) {
    const invested     = holding.quantity * holding.avgBuyPrice;
    const livePrice    = stockPrices[holding.symbol] || holding.avgBuyPrice;
    const currentWorth = holding.quantity * livePrice;

    totalInvested += invested;
    currentValue  += currentWorth;
  }

  this.totalInvested  = parseFloat(totalInvested.toFixed(2));
  this.currentValue   = parseFloat(currentValue.toFixed(2));
  this.totalPnL       = parseFloat((currentValue - totalInvested).toFixed(2));
  this.totalPnLPercent =
    totalInvested > 0
      ? parseFloat((((currentValue - totalInvested) / totalInvested) * 100).toFixed(2))
      : 0;
};

module.exports = mongoose.model("Portfolio", portfolioSchema);
