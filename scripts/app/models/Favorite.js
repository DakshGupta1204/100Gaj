import mongoose, { Schema, models } from 'mongoose';
const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
}, {
    timestamps: true,
});
// Create a compound index to ensure a user can only favorite a property once
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });
const Favorite = models.Favorite || mongoose.model('Favorite', favoriteSchema);
export default Favorite;
