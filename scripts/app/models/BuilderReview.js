import mongoose, { Schema, models } from 'mongoose';
const builderReviewSchema = new Schema({
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
}, {
    timestamps: true,
});
// Create index for better query performance
builderReviewSchema.index({ builder: 1, createdAt: -1 });
const BuilderReview = models.BuilderReview || mongoose.model('BuilderReview', builderReviewSchema);
export default BuilderReview;
