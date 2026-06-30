const express = require("express");
const authMiddleware = require("../middleware/auth");
const reportController = require("../controllers/reportController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", reportController.listReports);
router.get("/:id", reportController.getReport);

module.exports = router;
