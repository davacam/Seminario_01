const prisma = require("../config/database");
const { hashPassword, comparePassword } = require("../utils/password");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { company: true },
  });

  if (!user) {
    throw {
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  if (user.status !== "ACTIVE") {
    throw {
      statusCode: 403,
      message: "User account is not active",
    };
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);
  if (!passwordMatch) {
    throw {
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  // Actualizar último login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      companyId: user.companyId,
      company: user.company,
    },
  };
};

const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    include: { company: true },
  });

  if (!user || user.status !== "ACTIVE") {
    throw {
      statusCode: 401,
      message: "Invalid or expired refresh token",
    };
  }

  const newAccessToken = generateAccessToken(user);

  return {
    accessToken: newAccessToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      companyId: user.companyId,
    },
  };
};

const createUser = async (email, password, fullName, role, companyId) => {
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role,
      companyId,
    },
    include: { company: true },
  });

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    companyId: user.companyId,
  };
};

module.exports = {
  login,
  refreshAccessToken,
  createUser,
};
