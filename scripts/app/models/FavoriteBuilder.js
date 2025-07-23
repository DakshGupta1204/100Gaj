import mongoose, { Schema, models } from 'mongoose';
const favoriteBuilderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    builder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Builder',
        required: true,
    },
}, {
    timestamps: true,
});
// Create a compound index to ensure a user can only favorite a builder once
favoriteBuilderSchema.index({ user: 1, builder: 1 }, { unique: true });
const FavoriteBuilder = models.FavoriteBuilder || mongoose.model('FavoriteBuilder', favoriteBuilderSchema);
export default FavoriteBuilder;
