const { body, validationResult } = require("express-validator");
const taskService = require("../services/taskService");

const validateCreateTask = [
  body("title").trim().isLength({ min: 3 }),
  body("description").optional().trim(),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
];

const ensureTechnicianTaskAccess = async (req) => {
  const task = await taskService.getTaskById(req.params.id, req.user.companyId);

  if (!task) {
    throw { statusCode: 404, message: "Task not found" };
  }

  if (req.user.role === "TECHNICIAN" && task.assignedToId !== req.user.sub) {
    throw { statusCode: 403, message: "You can only manage your assigned tasks" };
  }

  return task;
};

const listTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * 50;
    const filters = {};

    if (req.query.status) filters.status = req.query.status;
    if (req.user.role === "TECHNICIAN") {
      filters.assignedToId = req.user.sub;
    }

    const [tasks, total] = await Promise.all([
      taskService.getAllTasks(req.user.companyId, filters, skip, 50),
      taskService.countTasks(req.user.companyId, filters),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: { page, total, totalPages: Math.ceil(total / 50) },
    });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await ensureTechnicianTaskAccess(req);
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const taskData =
      req.user.role === "TECHNICIAN"
        ? { ...req.body, assignedToId: req.user.sub }
        : req.body;
    const task = await taskService.createTask(
      req.user.companyId,
      req.user.sub,
      taskData
    );
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    await ensureTechnicianTaskAccess(req);
    const taskData =
      req.user.role === "TECHNICIAN"
        ? (({ title, description, priority, status, dueDate }) => ({
            title,
            description,
            priority,
            status,
            dueDate,
          }))(req.body)
        : req.body;
    const task = await taskService.updateTask(
      req.params.id,
      req.user.companyId,
      taskData
    );
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    await ensureTechnicianTaskAccess(req);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status required" });
    }
    const task = await taskService.updateTaskStatus(
      req.params.id,
      req.user.companyId,
      status
    );
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await ensureTechnicianTaskAccess(req);
    await taskService.deleteTask(req.params.id, req.user.companyId);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTasks,
  getTask,
  createTask: [validateCreateTask, createTask],
  updateTask,
  updateTaskStatus,
  deleteTask,
};
