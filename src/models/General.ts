import mongoose, { Document, Schema } from 'mongoose';

export interface IGeneral  {
  keywords: string[];
  interval: Number;
  createdAt: Date;
}

const GeneralSchema = new Schema<IGeneral>({
  keywords: {
    type: [String],
    required: true,
    trim: true
  },
  interval: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});


export const General = mongoose.model<IGeneral>('General', GeneralSchema);
