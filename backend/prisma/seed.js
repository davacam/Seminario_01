const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.upsert({
    where: { slug: "techdesk-demo" },
    update: {},
    create: {
      name: "TechDesk Demo",
      slug: "techdesk-demo",
      subscriptionPlan: "demo",
      maxUsers: 50,
    },
  });

  const passwordHash = await bcrypt.hash("Admin@12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@techdesk.com" },
    update: {
      passwordHash,
      status: "ACTIVE",
      role: "ADMIN",
      companyId: company.id,
    },
    create: {
      companyId: company.id,
      email: "admin@techdesk.com",
      passwordHash,
      fullName: "Admin Demo",
      phone: "+573000000000",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const technicianPasswordHash = await bcrypt.hash("Tecnico@12345", 10);
  const technician = await prisma.user.upsert({
    where: { email: "tecnico@techdesk.com" },
    update: {
      passwordHash: technicianPasswordHash,
      status: "ACTIVE",
      role: "TECHNICIAN",
      companyId: company.id,
    },
    create: {
      companyId: company.id,
      email: "tecnico@techdesk.com",
      passwordHash: technicianPasswordHash,
      fullName: "Tecnico Demo",
      phone: "+573001112233",
      role: "TECHNICIAN",
      status: "ACTIVE",
    },
  });

  const client = await prisma.client.upsert({
    where: { id: "11111111-1111-4111-8111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-4111-8111-111111111111",
      companyId: company.id,
      name: "Cliente Demo S.A.S.",
      email: "contacto@clientedemo.com",
      phone: "+573002223344",
      address: "Calle 100 # 15-20",
      city: "Bogota",
      country: "Colombia",
      contactPerson: "Laura Gomez",
      status: "ACTIVE",
    },
  });

  await prisma.task.upsert({
    where: { id: "22222222-2222-4222-8222-222222222222" },
    update: {},
    create: {
      id: "22222222-2222-4222-8222-222222222222",
      companyId: company.id,
      clientId: client.id,
      createdById: admin.id,
      assignedToId: technician.id,
      title: "Instalacion de router",
      description: "Instalar y validar conectividad en sede principal.",
      priority: "HIGH",
      status: "OPEN",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  console.log("Seed listo:");
  console.log("Admin: admin@techdesk.com / Admin@12345");
  console.log("Tecnico: tecnico@techdesk.com / Tecnico@12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
