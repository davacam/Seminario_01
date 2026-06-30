const prisma = require("../config/database");

const getAllReports = async (companyId, skip = 0, take = 50) => {
  return prisma.report.findMany({
    where: { companyId },
    skip,
    take,
    include: {
      task: { select: { id: true, title: true, status: true } },
      generatedBy: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getReportById = async (reportId, companyId) => {
  return prisma.report.findFirst({
    where: { id: reportId, companyId },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          client: { select: { id: true, name: true, email: true, phone: true } },
          assignedTo: { select: { id: true, fullName: true, email: true } },
        },
      },
      generatedBy: { select: { id: true, fullName: true, email: true } },
    },
  });
};

const countReports = async (companyId) => {
  return prisma.report.count({ where: { companyId } });
};

module.exports = {
  getAllReports,
  getReportById,
  countReports,
};
