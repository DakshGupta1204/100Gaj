import mongoose, { Schema, models } from 'mongoose';

interface IFavoriteLocality {
  user: mongoose.Types.ObjectId;
  name: string;
  city?: string;
  state?: string;
  image?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteLocalitySchema = new Schema<IFavoriteLocality>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only favorite a locality once
favoriteLocalitySchema.index({ user: 1, name: 1 }, { unique: true });

const FavoriteLocality = models.FavoriteLocality || mongoose.model<IFavoriteLocality>('FavoriteLocality', favoriteLocalitySchema);

export default FavoriteLocality; 