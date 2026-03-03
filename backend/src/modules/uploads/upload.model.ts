import mongoose, { Schema } from "mongoose";
import { IUpload } from "./upload.interface";

const uploadSchema = new Schema<IUpload>(
  {
    originalName: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for cron job - ishlatilmagan fayllarni tezda topish uchun
uploadSchema.index({ isUsed: 1, createdAt: 1 });

const Upload = mongoose.model<IUpload>("Upload", uploadSchema);

export default Upload;
