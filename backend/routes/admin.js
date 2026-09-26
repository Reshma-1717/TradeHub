const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get("/stats",                     ctrl.getDashboardStats);
router.get("/users",                     ctrl.getAllUsers);
router.put("/users/:id/toggle",          ctrl.toggleUserStatus);
router.put("/users/:id/balance",         ctrl.resetUserBalance);
router.get("/transactions",              ctrl.getAllTransactions);

module.exports = router;
