const prisma = require("../config/database");

const getAllTasks = async (companyId, filters = {}, skip = 0, take = 50) => {
  const where = { companyId };

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters.createdById) where.createdById = filters.createdById;
  if (filters.clientId) where.clientId = filters.clientId;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.task.findMany({
    where,
    skip,
    take,
    include: {
      createdBy: { select: { id: true, fullName: true } },
      assignedTo: { select: { id: true, fullName: true } },
      client: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getTaskById = async (taskId, companyId) => {
  return prisma.task.findFirst({
    where: { id: taskId, companyId },
    include: {
      createdBy: { select: { id: true, fullName: true } },
      assignedTo: { select: { id: true, fullName: true } },
      client: { select: { id: true, name: true } },
      evidence: true,
    },
  });
};

const createTask = async (companyId, userId, taskData) => {
  const { title, description, priority, clientId, assignedToId, dueDate } =
    taskData;

  return prisma.task.create({
    data: {
      companyId,
      title,
      description: description || null,
      priority: priority || "MEDIUM",
      status: "OPEN",
      clientId: clientId || null,
      createdById: userId,
      assignedToId: assignedToId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: {
      createdBy: { select: { id: true, fullName: true } },
      assignedTo: { select: { id: true, fullName: true } },
      client: { select: { id: true, name: true } },
    },
  });
};

const updateTask = async (taskId, companyId, taskData) => {
  const { title, description, priority, status, assignedToId, dueDate } =
    taskData;

  const existingTask = await getTaskById(taskId, companyId);
  if (!existingTask) {
    throw { statusCode: 404, message: "Task not found" };
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: title || undefined,
      description: description || undefined,
      priority: priority || undefined,
      status: status || undefined,
      assignedToId: assignedToId || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
    include: {
      createdBy: { select: { id: true, fullName: true } },
      assignedTo: { select: { id: true, fullName: true } },
      client: { select: { id: true, name: true } },
    },
  });
};

const updateTaskStatus = async (taskId, companyId, newStatus) => {
  const existingTask = await getTaskById(taskId, companyId);
  if (!existingTask) {
    throw { statusCode: 404, message: "Task not found" };
  }

  const updates = { status: newStatus };

  if (newStatus === "COMPLETED") {
    updates.completedAt = new Date();
  } else if (newStatus === "IN_PROGRESS") {
    updates.startedAt = new Date();
  }

  return prisma.task.update({
    where: { id: taskId },
    data: updates,
    include: {
      assignedTo: { select: { id: true, fullName: true } },
    },
  });
};

const deleteTask = async (taskId, companyId) => {
  const existingTask = await getTaskById(taskId, companyId);
  if (!existingTask) {
    throw { statusCode: 404, message: "Task not found" };
  }

  return prisma.task.delete({
    where: { id: taskId },
  });
};

const countTasks = async (companyId, filters = {}) => {
  const where = { companyId };
  if (filters.status) where.status = filters.status;
  if (filters.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters.createdById) where.createdById = filters.createdById;

  return prisma.task.count({ where });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  countTasks,
};
