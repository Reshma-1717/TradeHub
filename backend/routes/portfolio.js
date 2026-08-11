const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/portfolioController");
const { protect } = require("../middleware/auth");

router.get("/",        protect, ctrl.getPortfolio);
router.get("/summary", protect, ctrl.getSummary);

module.exports = router;
