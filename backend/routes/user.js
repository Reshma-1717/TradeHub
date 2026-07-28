const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const { protect } = require("../middleware/auth");

// GET /api/user/profile
router.get("/profile", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/profile
router.put("/profile", protect, async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    ).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/change-password
router.put("/change-password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
