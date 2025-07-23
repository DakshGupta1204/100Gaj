import mongoose, { Schema, models } from 'mongoose';

interface IFavorite {
  user: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only favorite a property once
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

const Favorite = models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema);

export default Favorite; 