import { Request, Response, NextFunction } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import Upload from "./upload.model";
import s3Client from "../../config/s3";
import config from "../../config";

interface MulterS3File extends Express.Multer.File {
  key: string;
  location: string;
  bucket: string;
}

class UploadController {
  // POST /api/uploads/single - Bitta fayl yuklash
  async uploadSingle(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const file = req.file as MulterS3File | undefined;

      if (!file) {
        res.status(400).json({
          success: false,
          message: "File is required",
        });
        return;
      }

      const upload = await Upload.create({
        originalName: file.originalname,
        key: file.key,
        url: file.location,
        mimetype: file.mimetype,
        size: file.size,
      });

      res.status(201).json({
        success: true,
        data: upload,
        message: "File uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/uploads/multiple - Ko'p fayl yuklash
  async uploadMultiple(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const files = req.files as MulterS3File[] | undefined;

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: "At least one file is required",
        });
        return;
      }

      const uploads = await Upload.insertMany(
        files.map((file) => ({
          originalName: file.originalname,
          key: file.key,
          url: file.location,
          mimetype: file.mimetype,
          size: file.size,
        })),
      );

      res.status(201).json({
        success: true,
        data: uploads,
        message: `${uploads.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/uploads - Barcha uploadlarni olish
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const [uploads, total] = await Promise.all([
        Upload.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Upload.countDocuments(),
      ]);

      res.json({
        success: true,
        data: uploads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/uploads/:id - Bitta uploadni olish
  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const upload = await Upload.findById(req.params.id);

      if (!upload) {
        res.status(404).json({
          success: false,
          message: "Upload not found",
        });
        return;
      }

      res.json({
        success: true,
        data: upload,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/uploads/:id/mark-used - Faylni ishlatilgan deb belgilash
  async markAsUsed(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const upload = await Upload.findByIdAndUpdate(
        req.params.id,
        { isUsed: true, lastUsedAt: new Date() },
        { new: true },
      );

      if (!upload) {
        res.status(404).json({
          success: false,
          message: "Upload not found",
        });
        return;
      }

      res.json({
        success: true,
        data: upload,
        message: "Upload marked as used",
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/uploads/:id - Faylni o'chirish (S3 + DB)
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const upload = await Upload.findById(req.params.id);

      if (!upload) {
        res.status(404).json({
          success: false,
          message: "Upload not found",
        });
        return;
      }

      // S3 dan o'chirish
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: config.aws.s3Bucket,
          Key: upload.key,
        }),
      );

      // DB dan o'chirish
      await Upload.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Upload deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();
