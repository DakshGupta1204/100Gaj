import mongoose, { Schema, models } from 'mongoose';


// Define the property schema with all necessary fields
interface IProperty {
  title: string;
  description: string;
  price: number;
  propertyType: string; // apartment, house, villa, commercial, etc.
  status: string; // active, pending, sold
  bedrooms: number;
  bathrooms: number;
  area: number; // square feet/meters
  yearBuilt?: number;
  floors?: number;
  parking?: number;
  furnished: boolean;
  amenities: string[];
  features: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    location: {
      type: string;
      coordinates: number[]; // [longitude, latitude]
    };
  };
  images: string[];
  videos?: string[];
  owner: mongoose.Types.ObjectId;
  ownerDetails: {
    name: string;
    phone: string;
  };
  views: number;
  favorites: number;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['apartment', 'house', 'villa', 'land', 'commercial', 'office', 'other'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'pending', 'sold', 'rented', 'expired', 'draft'],
      default: 'active',
    },
    bedrooms: {
      type: Number,
      required: function() { return this.propertyType !== 'land' && this.propertyType !== 'commercial'; },
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: function() { return this.propertyType !== 'land' && this.propertyType !== 'commercial'; },
      min: 0,
    },
    area: {
      type: Number,
      required: true,
      min: 0,
    },
    yearBuilt: {
      type: Number,
    },
    floors: {
      type: Number,
      min: 0,
    },
    parking: {
      type: Number,
      min: 0,
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    amenities: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: 'India',
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    images: {
      type: [String],
      required: true,
      validate: [
        {
          validator: function(v: string[]) {
            return v.length > 0;
          },
          message: 'At least one image is required',
        },
      ],
    },
    videos: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerDetails: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add geospatial index on location field for efficient location-based queries
propertySchema.index({ 'address.location': '2dsphere' });

// Text index for full-text search
propertySchema.index({ 
  title: 'text',
  description: 'text',
  'address.street': 'text',
  'address.city': 'text',
  'address.state': 'text'
});

// Check if model exists already to prevent recompiling during hot reload in development
const Property = models.Property || mongoose.model<IProperty>('Property', propertySchema);

export default Property; 