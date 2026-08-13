const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/watchlistController");
const { protect } = require("../middleware/auth");

router.get("/",                    protect, ctrl.getWatchlist);
router.post("/add",                protect, ctrl.addToWatchlist);
router.delete("/remove/:symbol",   protect, ctrl.removeFromWatchlist);

module.exports = router;
