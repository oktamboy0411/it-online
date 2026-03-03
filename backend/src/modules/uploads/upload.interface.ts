import { Document } from "mongoose";

export interface IUpload extends Document {
  originalName: string;
  key: string;
  url: string;
  mimetype: string;
  size: number;
  isUsed: boolean;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
