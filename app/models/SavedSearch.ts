import mongoose, { Schema, models } from 'mongoose';

interface ISavedSearch {
  user: mongoose.Types.ObjectId;
  name: string;
  filters: {
    location?: {
      city?: string;
      state?: string;
      country?: string;
      bounds?: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
    };
    propertyType?: string[];
    listingType?: string;
    priceMin?: number;
    priceMax?: number;
    bedroomsMin?: number;
    bathroomsMin?: number;
    areaMin?: number;
    areaMax?: number;
    amenities?: string[];
    features?: string[];
    keywords?: string;
  };
  alertFrequency?: string; // none, daily, weekly
  createdAt: Date;
  updatedAt: Date;
}

const savedSearchSchema = new Schema<ISavedSearch>(
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
    filters: {
      location: {
        city: String,
        state: String,
        country: String,
        bounds: {
          north: Number,
          south: Number,
          east: Number,
          west: Number,
        },
      },
      propertyType: [String],
      listingType: String,
      priceMin: Number,
      priceMax: Number,
      bedroomsMin: Number,
      bathroomsMin: Number,
      areaMin: Number,
      areaMax: Number,
      amenities: [String],
      features: [String],
      keywords: String,
    },
    alertFrequency: {
      type: String,
      enum: ['none', 'daily', 'weekly'],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

const SavedSearch = models.SavedSearch || mongoose.model<ISavedSearch>('SavedSearch', savedSearchSchema);

export default SavedSearch; 