const express = require("express");
const authMiddleware = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");
const clientController = require("../controllers/clientController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", clientController.listClients);
router.post("/", authorizeRoles("ADMIN"), ...clientController.createClient);
router.get("/:id", clientController.getClient);
router.put("/:id", authorizeRoles("ADMIN"), clientController.updateClient);
router.delete("/:id", authorizeRoles("ADMIN"), clientController.deleteClient);

module.exports = router;
