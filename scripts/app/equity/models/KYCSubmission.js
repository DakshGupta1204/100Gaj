import mongoose from "mongoose";
const kycSubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EquityUser",
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    panNumber: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    panCardUrl: {
        type: String,
        required: true,
    },
    aadhaarCardUrl: {
        type: String,
        required: true,
    },
    bankDetails: {
        bankName: {
            type: String,
            required: true,
        },
        accountNumber: {
            type: String,
            required: true,
        },
        ifscCode: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    verifiedAt: {
        type: Date,
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EquityUser",
    },
    rejectionReason: {
        type: String,
    },
});
const KYCSubmission = mongoose.models.KYCSubmission || mongoose.model("KYCSubmission", kycSubmissionSchema);
export default KYCSubmission;
