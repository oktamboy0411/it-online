import app from "./app";
import config from "./config";
import connectDB from "./config/database";
import startCleanupCron from "./cron/cleanupUnusedFiles";

const startServer = async (): Promise<void> => {
  // MongoDB ga ulanish
  await connectDB();

  // Cron joblarni ishga tushirish
  startCleanupCron();

  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
