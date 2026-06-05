const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient({
  errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

prismaClient
  .$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

module.exports = prismaClient;
