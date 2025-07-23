import mongoose, { Schema, Document, models } from 'mongoose';

export interface IVerificationRequest extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'agent' | 'builder';
  status: 'pending' | 'approved' | 'rejected';
  requestDetails?: {
    licenseNumber?: string;
    agency?: string;
    experience?: number;
    specializations?: string[];
    languages?: string[];
    agentImage?: string; // URL to agent's profile image
    companyName?: string;
    established?: string;
    headquarters?: string;
    specialization?: string;
    additionalInfo?: string;
    builderImage?: string; // URL to builder's company image
    logo?: string; // URL to builder's company logo
  };
  documents?: string[]; // URLs to uploaded verification documents
  reviewedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRequestSchema = new Schema<IVerificationRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['agent', 'builder'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requestDetails: {
      licenseNumber: String,
      agency: String,
      experience: Number,
      specializations: [String],
      languages: [String],
      agentImage: String,
      companyName: String,
      established: String,
      headquarters: String,
      specialization: String,
      additionalInfo: String,
      builderImage: String,
      logo: String,
    },
    documents: [String],
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: String,
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only have one pending request per type
VerificationRequestSchema.index({ userId: 1, type: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

const VerificationRequest = models.VerificationRequest || mongoose.model<IVerificationRequest>('VerificationRequest', VerificationRequestSchema);

export default VerificationRequest; 