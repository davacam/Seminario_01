const express = require("express");
const authMiddleware = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");
const taskController = require("../controllers/taskController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", taskController.listTasks);
router.post("/", authorizeRoles("ADMIN", "TECHNICIAN"), ...taskController.createTask);
router.get("/:id", taskController.getTask);
router.put("/:id", authorizeRoles("ADMIN", "TECHNICIAN"), taskController.updateTask);
router.patch("/:id/status", authorizeRoles("ADMIN", "TECHNICIAN"), taskController.updateTaskStatus);
router.delete("/:id", authorizeRoles("ADMIN", "TECHNICIAN"), taskController.deleteTask);

module.exports = router;
