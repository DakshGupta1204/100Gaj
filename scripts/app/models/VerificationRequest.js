import mongoose, { Schema, models } from 'mongoose';
const VerificationRequestSchema = new Schema({
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
}, {
    timestamps: true,
});
// Create a compound index to ensure a user can only have one pending request per type
VerificationRequestSchema.index({ userId: 1, type: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });
const VerificationRequest = models.VerificationRequest || mongoose.model('VerificationRequest', VerificationRequestSchema);
export default VerificationRequest;
