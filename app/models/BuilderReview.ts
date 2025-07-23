import mongoose, { Schema, models } from 'mongoose';

interface IBuilderReview {
  builder: mongoose.Types.ObjectId;
  reviewer?: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  user: string; // Name of the reviewer
  status: string; // pending, approved, rejected
  createdAt: Date;
  updatedAt: Date;
}

const builderReviewSchema = new Schema<IBuilderReview>(
  {
    builder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    user: {
      type: String,
      required: true,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Auto-approve for now
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
builderReviewSchema.index({ builder: 1, createdAt: -1 });

const BuilderReview = models.BuilderReview || mongoose.model<IBuilderReview>('BuilderReview', builderReviewSchema);

export default BuilderReview;
