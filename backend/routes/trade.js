const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/tradeController");
const { protect } = require("../middleware/auth");

router.post("/buy",     protect, ctrl.buyStock);
router.post("/sell",    protect, ctrl.sellStock);
router.get("/history",  protect, ctrl.getHistory);

module.exports = router;
