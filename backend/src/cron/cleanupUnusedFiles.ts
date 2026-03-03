import cron from "node-cron";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import Upload from "../modules/uploads/upload.model";
import s3Client from "../config/s3";
import config from "../config";

/**
 * Ishlatilmagan fayllarni avtomatik o'chirish cron job
 * Har soatda ishlaydi va 1 kundan oshgan ishlatilmagan fayllarni o'chiradi
 */
const startCleanupCron = (): void => {
  // Har soatda ishlaydi: "0 * * * *"
  cron.schedule("0 * * * *", async () => {
    console.log("[CRON] Running unused file cleanup...");

    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // 1 kundan oshgan va ishlatilmagan fayllarni topish
      const unusedFiles = await Upload.find({
        isUsed: false,
        createdAt: { $lt: oneDayAgo },
      });

      if (unusedFiles.length === 0) {
        console.log("[CRON] No unused files to clean up");
        return;
      }

      console.log(
        `[CRON] Found ${unusedFiles.length} unused file(s) to delete`,
      );

      let deletedCount = 0;
      let errorCount = 0;

      for (const file of unusedFiles) {
        try {
          // S3 dan o'chirish
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: config.aws.s3Bucket,
              Key: file.key,
            }),
          );

          // DB dan o'chirish
          await Upload.findByIdAndDelete(file._id);
          deletedCount++;
        } catch (err) {
          errorCount++;
          console.error(`[CRON] Failed to delete file ${file.key}:`, err);
        }
      }

      console.log(
        `[CRON] Cleanup complete: ${deletedCount} deleted, ${errorCount} errors`,
      );
    } catch (error) {
      console.error("[CRON] Cleanup job failed:", error);
    }
  });

  console.log("Cron job started: Unused file cleanup (every hour)");
};

export default startCleanupCron;
