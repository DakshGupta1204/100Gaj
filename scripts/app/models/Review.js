import mongoose, { Schema, models } from 'mongoose';
const reviewSchema = new Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    userName: {
        type: String,
        maxlength: 100,
    },
    propertyTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});
// Create compound index to ensure a user can only review an agent once
reviewSchema.index({ agent: 1, reviewer: 1 }, { unique: true });
const Review = models.Review || mongoose.model('Review', reviewSchema);
export default Review;
