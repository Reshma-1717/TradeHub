const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : "User",
      required : true,
      unique   : true,
    },
    stocks: [
      {
        stock: {
          type : mongoose.Schema.Types.ObjectId,
          ref  : "Stock",
        },
        symbol: {
          type     : String,
          uppercase: true,
        },
        addedAt: {
          type    : Date,
          default : Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

watchlistSchema.index({ user: 1 });

module.exports = mongoose.model("Watchlist", watchlistSchema);
