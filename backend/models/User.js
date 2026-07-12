const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type     : String,
      required : [true, "Name is required"],
      trim     : true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type     : String,
      required : [true, "Email is required"],
      unique   : true,
      lowercase: true,
      trim     : true,
      match    : [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type     : String,
      required : [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select   : false, // never return password in queries
    },
    role: {
      type    : String,
      enum    : ["user", "admin"],
      default : "user",
    },
    // Virtual trading balance — starts at $10,000
    balance: {
      type    : Number,
      default : parseFloat(process.env.STARTING_BALANCE) || 10000,
      min     : [0, "Balance cannot be negative"],
    },
    avatar: {
      type    : String,
      default : "",
    },
    isActive: {
      type    : Boolean,
      default : true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ── Indexes ─────────────────────────────────────────────────────
userSchema.index({ email: 1 });

// ── Pre-save: Hash password ─────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt   = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method: Compare entered password with hashed ────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Method: Generate JWT Token ──────────────────────────────────
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

// ── Virtual: initials for avatar ────────────────────────────────
userSchema.virtual("initials").get(function () {
  return this.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

module.exports = mongoose.model("User", userSchema);
