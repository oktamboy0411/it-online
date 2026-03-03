import { Router } from "express";
import uploadController from "./upload.controller";
import upload from "../../middlewares/upload";

const router = Router();

// Bitta fayl yuklash
router.post("/single", upload.single("file"), uploadController.uploadSingle);

// Ko'p fayl yuklash (max 10)
router.post(
  "/multiple",
  upload.array("files", 10),
  uploadController.uploadMultiple,
);

// Barcha uploadlarni olish
router.get("/", uploadController.getAll);

// Bitta uploadni olish
router.get("/:id", uploadController.getById);

// Faylni ishlatilgan deb belgilash
router.patch("/:id/mark-used", uploadController.markAsUsed);

// Faylni o'chirish
router.delete("/:id", uploadController.delete);

export default router;
