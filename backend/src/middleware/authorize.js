const ROLE_PERMISSIONS = {
  ADMIN: ["read:all", "write:all", "delete:all", "manage:users", "manage:forms"],
  TECHNICIAN: [
    "read:own_tasks",
    "write:own_tasks",
    "read:forms",
    "submit:forms",
    "upload:evidence",
  ],
  CLIENT: ["read:own_tasks", "read:reports"],
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
};

const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
  authorizePermission,
  ROLE_PERMISSIONS,
};
