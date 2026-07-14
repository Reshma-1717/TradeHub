const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type     : String,
      required : [true, "Stock symbol is required"],
      unique   : true,
      uppercase: true,
      trim     : true,
    },
    companyName: {
      type     : String,
      required : [true, "Company name is required"],
      trim     : true,
    },
    currentPrice: {
      type    : Number,
      required: [true, "Current price is required"],
      min     : [0, "Price cannot be negative"],
    },
    previousClose: {
      type    : Number,
      default : 0,
    },
    openPrice: {
      type    : Number,
      default : 0,
    },
    highPrice: {
      type    : Number,
      default : 0,
    },
    lowPrice: {
      type    : Number,
      default : 0,
    },
    volume: {
      type    : Number,
      default : 0,
    },
    marketCap: {
      type    : Number,
      default : 0,
    },
    sector: {
      type : String,
      enum : [
        "Technology", "Healthcare", "Finance", "Energy",
        "Consumer", "Industrial", "Real Estate", "Utilities",
        "Materials", "Communication", "Other",
      ],
      default: "Other",
    },
    exchange: {
      type    : String,
      enum    : ["NYSE", "NASDAQ", "OTHER"],
      default : "NASDAQ",
    },
    // Price history for charts — last 30 data points
    priceHistory: [
      {
        price    : Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    isActive: {
      type    : Boolean,
      default : true,
    },
    lastUpdated: {
      type    : Date,
      default : Date.now,
    },
    // Computed fields
    change: {
      type    : Number,
      default : 0,
    },
    changePercent: {
      type    : Number,
      default : 0,
    },
    description: {
      type    : String,
      default : "",
    },
    logoUrl: {
      type    : String,
      default : "",
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ─────────────────────────────────────────────────────
stockSchema.index({ symbol: 1 });
stockSchema.index({ sector: 1 });
stockSchema.index({ companyName: "text" }); // text search

// ── Pre-save: Calculate change and changePercent ─────────────────
stockSchema.pre("save", function (next) {
  if (this.previousClose && this.previousClose > 0) {
    this.change        = parseFloat((this.currentPrice - this.previousClose).toFixed(2));
    this.changePercent = parseFloat(
      (((this.currentPrice - this.previousClose) / this.previousClose) * 100).toFixed(2)
    );
  }
  this.lastUpdated = Date.now();
  next();
});

// ── Static: Search stocks by symbol or name ─────────────────────
stockSchema.statics.search = function (query) {
  const regex = new RegExp(query, "i");
  return this.find({
    isActive: true,
    $or     : [{ symbol: regex }, { companyName: regex }],
  }).limit(10);
};

module.exports = mongoose.model("Stock", stockSchema);
