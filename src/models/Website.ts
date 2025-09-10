import mongoose, { Document, Schema } from 'mongoose';

export interface IWebsite extends Document {
  name: string;
  url: string;
  isActive: boolean;
  keywords?: string[];
  lastScanned?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteSchema = new Schema<IWebsite>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },

  keywords: [{
    type: String,
    trim: true
  }],
  lastScanned: {
    type: Date
  },
}, {
  timestamps: true
});

export const Website = mongoose.model<IWebsite>('Website', WebsiteSchema);
