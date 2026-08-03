// ── stocks.js ───────────────────────────────────────────────────
const express      = require("express");
const router       = express.Router();
const ctrl         = require("../controllers/stockController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/",              ctrl.getAllStocks);
router.get("/top/movers",    ctrl.getTopMovers);
router.get("/:symbol",       ctrl.getStockBySymbol);
router.post("/",             protect, adminOnly, ctrl.createStock);
router.put("/:id",           protect, adminOnly, ctrl.updateStock);
router.delete("/:id",        protect, adminOnly, ctrl.deleteStock);

module.exports = router;
