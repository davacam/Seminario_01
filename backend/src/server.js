const app = require("./app");
const env = require("./config/env");
require("./config/database");

const startServer = () => {
  app.listen(env.PORT, () => {
    const databaseHost =
      env.DATABASE_URL.split("@")[1]?.split("?")[0] || "configured";

    console.log("TechDesk Backend Server Running");
    console.log(`Port: ${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Database: ${databaseHost}`);
  });
};

startServer();
