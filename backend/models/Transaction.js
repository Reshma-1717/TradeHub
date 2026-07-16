const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : "User",
      required : true,
    },
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
    companyName: {
      type: String,
      default: "",
    },
    type: {
      type    : String,
      enum    : ["BUY", "SELL"],
      required: true,
    },
    quantity: {
      type    : Number,
      required: true,
      min     : [1, "Quantity must be at least 1"],
    },
    price: {
      type    : Number,
      required: true,
      min     : [0, "Price cannot be negative"],
    },
    totalAmount: {
      type    : Number,
      required: true,
    },
    // Balance after this transaction
    balanceAfter: {
      type    : Number,
      default : 0,
    },
    // P&L for SELL transactions
    realizedPnL: {
      type    : Number,
      default : 0,
    },
    status: {
      type    : String,
      enum    : ["SUCCESS", "FAILED"],
      default : "SUCCESS",
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ─────────────────────────────────────────────────────
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ stock: 1 });
transactionSchema.index({ type: 1 });

// ── Pre-save: Calculate total amount ────────────────────────────
transactionSchema.pre("save", function (next) {
  this.totalAmount = parseFloat((this.quantity * this.price).toFixed(2));
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
