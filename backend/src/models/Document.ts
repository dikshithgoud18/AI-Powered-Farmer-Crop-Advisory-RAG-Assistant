import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  chunkCount: number;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'failed';
}

const DocumentSchema: Schema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  chunkCount: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' }
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
