const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { updateAllPrices } = require("./utils/priceUpdater");

const authRoutes      = require("./routes/auth");
const userRoutes      = require("./routes/user");
const stockRoutes     = require("./routes/stocks");
const tradeRoutes     = require("./routes/trade");
const portfolioRoutes = require("./routes/portfolio");
const watchlistRoutes = require("./routes/watchlist");
const adminRoutes     = require("./routes/admin");
const errorHandler    = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 500,
  message  : { success: false, message: "Too many requests." },
});
app.use("/api/", limiter);

app.use("/api/auth",      authRoutes);
app.use("/api/user",      userRoutes);
app.use("/api/stocks",    stockRoutes);
app.use("/api/trade",     tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/admin",     adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "TradeHub API is running" });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    updateAllPrices();
    setInterval(updateAllPrices, 5 * 60 * 1000);
  });
});
module.exports = app;