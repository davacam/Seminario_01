const app = require("./app");
const env = require("./config/env");
require("./config/database"); // Initialize Prisma

const startServer = () => {
  app.listen(env.PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 TechDesk Backend Server Running           ║
║  📍 Port: ${env.PORT}                            
║  🔧 Environment: ${env.NODE_ENV}               
║  🗄️  Database: ${env.DATABASE_URL.split("@")[1]?.split("?")[0] || "configured"}
╚═══════════════════════════════════════════════╝
    `);
  });
};

startServer();
