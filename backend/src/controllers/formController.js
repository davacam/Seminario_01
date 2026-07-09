const { body, validationResult } = require("express-validator");
const formService = require("../services/formService");

const validateCreateForm = [
  body("title").trim().isLength({ min: 3 }).withMessage("Title is required"),
  body("description").optional().trim(),
  body("fields").isArray({ min: 1 }).withMessage("Fields are required"),
];

const listForms = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * 50;
    const filters = {};

    if (req.query.status) filters.status = req.query.status;
    if (req.query.search) filters.search = req.query.search;

    const [forms, total] = await Promise.all([
      formService.getAllForms(req.user.companyId, filters, skip, 50),
      formService.countForms(req.user.companyId, filters),
    ]);

    res.json({
      success: true,
      data: forms,
      pagination: { page, total, totalPages: Math.ceil(total / 50) },
    });
  } catch (error) {
    next(error);
  }
};

const getForm = async (req, res, next) => {
  try {
    const form = await formService.getFormById(req.params.id, req.user.companyId);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }
    res.json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

const createForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const form = await formService.createForm(
      req.user.companyId,
      req.user.sub,
      req.body
    );

    res.status(201).json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

const updateForm = async (req, res, next) => {
  try {
    const form = await formService.updateForm(
      req.params.id,
      req.user.companyId,
      req.body
    );
    res.json({ success: true, data: form });
  } catch (error) {
    next(error);
  }
};

const archiveForm = async (req, res, next) => {
  try {
    await formService.archiveForm(req.params.id, req.user.companyId);
    res.json({ success: true, message: "Form archived successfully" });
  } catch (error) {
    next(error);
  }
};

const submitFormResponse = async (req, res, next) => {
  try {
    const response = await formService.submitFormResponse(
      req.params.id,
      req.user.companyId,
      req.user.sub,
      req.body
    );
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listForms,
  getForm,
  createForm: [validateCreateForm, createForm],
  updateForm,
  archiveForm,
  submitFormResponse,
};
