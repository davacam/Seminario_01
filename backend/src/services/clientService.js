const prisma = require("../config/database");

const getAllClients = async (companyId, skip = 0, take = 50) => {
  return prisma.client.findMany({
    where: { companyId },
    skip,
    take,
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getClientById = async (clientId, companyId) => {
  return prisma.client.findFirst({
    where: { id: clientId, companyId },
    include: {
      _count: { select: { tasks: true } },
      tasks: { select: { id: true, title: true, status: true } },
    },
  });
};

const createClient = async (companyId, clientData) => {
  const { name, email, phone, address, city, state, country, contactPerson } =
    clientData;

  return prisma.client.create({
    data: {
      companyId,
      name,
      email: email || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      contactPerson: contactPerson || null,
      status: "ACTIVE",
    },
  });
};

const updateClient = async (clientId, companyId, clientData) => {
  const existingClient = await getClientById(clientId, companyId);
  if (!existingClient) {
    throw { statusCode: 404, message: "Client not found" };
  }

  return prisma.client.update({
    where: { id: clientId },
    data: clientData,
  });
};

const deleteClient = async (clientId, companyId) => {
  const existingClient = await getClientById(clientId, companyId);
  if (!existingClient) {
    throw { statusCode: 404, message: "Client not found" };
  }

  return prisma.client.update({
    where: { id: clientId },
    data: { status: "INACTIVE" },
  });
};

const countClients = async (companyId) => {
  return prisma.client.count({ where: { companyId } });
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  countClients,
};
