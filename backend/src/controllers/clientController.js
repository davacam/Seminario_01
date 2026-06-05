const { body, validationResult } = require("express-validator");
const clientService = require("../services/clientService");

const validateCreateClient = [
  body("name").trim().isLength({ min: 2 }),
  body("email").optional({ checkFalsy: true }).isEmail(),
  body("phone").optional({ checkFalsy: true }).isMobilePhone(),
];

const listClients = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * 50;

    const [clients, total] = await Promise.all([
      clientService.getAllClients(req.user.companyId, skip, 50),
      clientService.countClients(req.user.companyId),
    ]);

    res.json({
      success: true,
      data: clients,
      pagination: { page, total, totalPages: Math.ceil(total / 50) },
    });
  } catch (error) {
    next(error);
  }
};

const getClient = async (req, res, next) => {
  try {
    const client = await clientService.getClientById(
      req.params.id,
      req.user.companyId
    );
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const client = await clientService.createClient(
      req.user.companyId,
      req.body
    );
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await clientService.updateClient(
      req.params.id,
      req.user.companyId,
      req.body
    );
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await clientService.deleteClient(
      req.params.id,
      req.user.companyId
    );
    res.json({ success: true, message: "Client deactivated", data: client });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listClients,
  getClient,
  createClient: [validateCreateClient, createClient],
  updateClient,
  deleteClient,
};
