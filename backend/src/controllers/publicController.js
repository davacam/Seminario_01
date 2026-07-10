const prisma = require("../config/database");

const getLoginSummary = async (req, res, next) => {
  try {
    const [users, tasks, clients] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.client.count(),
    ]);

    res.json({
      success: true,
      data: { users, tasks, clients },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLoginSummary };
