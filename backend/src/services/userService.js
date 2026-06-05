const prisma = require("../config/database");
const { hashPassword } = require("../utils/password");

const getAllUsers = async (companyId, skip = 0, take = 100) => {
  return prisma.user.findMany({
    where: { companyId },
    skip,
    take,
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getUserById = async (userId, companyId) => {
  return prisma.user.findFirst({
    where: { id: userId, companyId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const createUser = async (companyId, userData) => {
  const { email, password, fullName, phone, role } = userData;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw {
      statusCode: 409,
      message: "Email already in use",
    };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      phone: phone || null,
      role,
      companyId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

const updateUser = async (userId, companyId, userData) => {
  const { fullName, phone, role, status } = userData;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: fullName || undefined,
      phone: phone || undefined,
      role: role || undefined,
      status: status || undefined,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return user;
};

const deleteUser = async (userId, companyId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status: "INACTIVE" },
    select: {
      id: true,
      status: true,
    },
  });
};

const countUsers = async (companyId) => {
  return prisma.user.count({ where: { companyId } });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  countUsers,
};
