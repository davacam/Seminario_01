const express = require("express");
const authMiddleware = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");
const userController = require("../controllers/userController");

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Only ADMIN can manage users
router.use(authorizeRoles("ADMIN"));

router.get("/", userController.listUsers);
router.post("/", ...userController.createUser);
router.get("/:id", userController.getUser);
router.put("/:id", ...userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
