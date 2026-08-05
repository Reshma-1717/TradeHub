const axios = require("axios");
const Stock = require("../models/Stock");

const FINNHUB_KEY = process.env.FINNHUB_KEY;

const updateStockPrice = async (symbol) => {
  try {
    const res = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`
    );
    const data = res.data;

    if (data.c && data.c > 0) {
      await Stock.findOneAndUpdate(
        { symbol },
        {
          currentPrice  : parseFloat(data.c.toFixed(2)),
          previousClose : parseFloat(data.pc.toFixed(2)),
          openPrice     : parseFloat(data.o.toFixed(2)),
          highPrice     : parseFloat(data.h.toFixed(2)),
          lowPrice      : parseFloat(data.l.toFixed(2)),
          change        : parseFloat((data.c - data.pc).toFixed(2)),
          changePercent : parseFloat((((data.c - data.pc) / data.pc) * 100).toFixed(2)),
          lastUpdated   : Date.now(),
        }
      );
    }
  } catch (err) {
    console.log(`⚠️ Could not update ${symbol}:`, err.message);
  }
};

const updateAllPrices = async () => {
  try {
    const stocks = await Stock.find({ isActive: true }).select("symbol");
    console.log(`🔄 Updating prices for ${stocks.length} stocks...`);

    // Update one by one with delay (free tier = 60 calls/min)
    for (const stock of stocks) {
      await updateStockPrice(stock.symbol);
      await new Promise((r) => setTimeout(r, 1200)); // 1.2 sec delay
    }

    console.log("✅ All prices updated!");
  } catch (err) {
    console.error("❌ Price update failed:", err.message);
  }
};

module.exports = { updateAllPrices, updateStockPrice };