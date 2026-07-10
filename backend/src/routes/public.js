const express = require("express");
const { getLoginSummary } = require("../controllers/publicController");

const router = express.Router();

router.get("/summary", getLoginSummary);

module.exports = router;
