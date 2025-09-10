import mongoose, { Document, Schema } from 'mongoose';

export interface IJob  {
  data: String[];
  websiteId: String;
  createdAt?: Date;
}

const JobSchema = new Schema<IJob>({
  data: {
    type: [String],
    required: true,
    trim: true
  },
  websiteId: {
    type: Schema.Types.ObjectId,
    ref: 'Website',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});


export const Job = mongoose.model<IJob>('Job', JobSchema);
