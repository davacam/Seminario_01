const reportService = require("../services/reportService");

const listReports = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const take = 50;
    const skip = (page - 1) * take;

    const [reports, total] = await Promise.all([
      reportService.getAllReports(req.user.companyId, skip, take),
      reportService.countReports(req.user.companyId),
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getReport = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(
      req.params.id,
      req.user.companyId
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listReports,
  getReport,
};
