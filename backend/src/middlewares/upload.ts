import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import s3Client from "../config/s3";
import config from "../config";

const s3Storage = multerS3({
  s3: s3Client,
  bucket: config.aws.s3Bucket,
  metadata: (_req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `uploads/${Date.now()}-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// Ruxsat berilgan fayl turlari
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
];

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${file.mimetype}' is not allowed`));
  }
};

const upload = multer({
  storage: s3Storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

export default upload;
