const { body, validationResult } = require("express-validator");
const authService = require("../services/authService");

const validateLoginInput = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
];

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};

module.exports = {
  login,
  refresh,
  logout,
  getProfile,
  validateLoginInput,
};
