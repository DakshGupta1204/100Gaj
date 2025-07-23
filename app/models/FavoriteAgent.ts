import mongoose, { Schema, models } from 'mongoose';

interface IFavoriteAgent {
  user: mongoose.Types.ObjectId;
  agent: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteAgentSchema = new Schema<IFavoriteAgent>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only favorite an agent once
favoriteAgentSchema.index({ user: 1, agent: 1 }, { unique: true });

const FavoriteAgent = models.FavoriteAgent || mongoose.model<IFavoriteAgent>('FavoriteAgent', favoriteAgentSchema);

export default FavoriteAgent; 