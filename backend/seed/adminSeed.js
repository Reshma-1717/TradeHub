require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User     = require("../models/User");
const Portfolio= require("../models/Portfolio");
const Watchlist= require("../models/Watchlist");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for admin seeding...");

    const existingAdmin = await User.findOne({ email: "admin@tradehub.com" });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists. Skipping.");
      return mongoose.connection.close();
    }

    const admin = await User.create({
      name: "TradeHub Admin",
      email: "admin@tradehub.com",
      password: "Admin@123",
      role: "admin",
      balance: 100000,
    });

    await Portfolio.create({ user: admin._id, holdings: [] });
    await Watchlist.create({ user: admin._id, stocks: [] });

    console.log("🌱 Admin user created successfully!");
    console.log("   Email:    admin@tradehub.com");
    console.log("   Password: Admin@123");
    console.log("   ⚠️  Change this password after first login!");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Admin seeding failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();
