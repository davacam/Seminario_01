const { body, validationResult, param, query } = require("express-validator");
const userService = require("../services/userService");

const validateCreateUser = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("fullName").trim().isLength({ min: 2 }),
  body("role").isIn(["ADMIN", "TECHNICIAN", "CLIENT"]),
  body("phone").optional().isMobilePhone(),
];

const validateUpdateUser = [
  body("fullName").optional().trim().isLength({ min: 2 }),
  body("role").optional().isIn(["ADMIN", "TECHNICIAN", "CLIENT"]),
  body("status").optional().isIn(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  body("phone").optional().isMobilePhone(),
];

const listUsers = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const skip = Math.max(0, (parseInt(req.query.page) || 1) - 1) * 20;
    const take = 20;

    const [users, total] = await Promise.all([
      userService.getAllUsers(req.user.companyId, skip, take),
      userService.countUsers(req.user.companyId),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Math.floor(skip / take) + 1,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(
      req.params.id,
      req.user.companyId
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await userService.createUser(req.user.companyId, req.body);

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await userService.updateUser(
      req.params.id,
      req.user.companyId,
      req.body
    );

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(
      req.params.id,
      req.user.companyId
    );

    res.json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  getUser,
  createUser: [validateCreateUser, createUser],
  updateUser: [validateUpdateUser, updateUser],
  deleteUser,
};
