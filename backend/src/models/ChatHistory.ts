import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: any[];
}

export interface IChatHistory extends Document {
  sessionId: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sources: { type: Schema.Types.Mixed }
}, { _id: false });

const ChatHistorySchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  messages: [ChatMessageSchema],
}, { timestamps: true });

export default mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
