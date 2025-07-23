import mongoose, { Schema, models } from 'mongoose';
import './User'
// Define the property schema with all necessary fields
interface IProperty {
  title: string;
  description: string;
  price: number;
  propertyType: string; // apartment, house, villa, commercial, etc.
  subType?: string; // Studio Apartment, Builder Floor, etc.
  listingType: string; // sale, rent
  status: string; // active, pending, sold
  bedrooms: number;
  bathrooms: number;
  area: number; // square feet/meters
  carpetArea?: number; // carpet area in square feet/meters
  balconyCount?: number;
  yearBuilt?: number;
  floors?: number;
  parking?: number;
  furnished: boolean;
  furnishing?: string; // Unfurnished, Semi-Furnished, Fully Furnished
  propertyAge?: string; // New Construction, Less than 1 year, etc.
  possessionStatus?: string; // Ready to Move, Under Construction
  availableFrom?: string; // date when property is available
  facing?: string; // North, South, East, West, etc.
  waterElectricity?: string; // 24x7 Available, Limited Hours, etc.
  priceNegotiable?: boolean;
  maintenanceCharges?: number;
  securityDeposit?: number;
  ownershipType?: string; // Freehold, Leasehold, etc.
  amenities: string[];
  features: string[];
  address: {
    street: string;
    city: string;
    locality: string;
    state: string;
    zipCode: string;
    country: string;
    projectName?: string;
    floorNumber?: string;
    landmark?: string;
    location: {
      type: string;
      coordinates: number[]; // [longitude, latitude]
    };
  };
  images: string[];
  videos?: string[];
  virtualTourUrl?: string;
  floorPlans?: {
    name: string;
    image: string;
    description?: string;
  }[];
  owner: mongoose.Types.ObjectId;
  ownerDetails: {
    name: string;
    phone: string;
    email?: string;
  };
  agent?: mongoose.Types.ObjectId;
  views: number;
  favorites: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
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
    subType: {
      type: String,
    },
    listingType: {
      type: String,
      required: true,
      enum: ['sale', 'rent'],
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
    carpetArea: {
      type: Number,
      min: 0,
    },
    balconyCount: {
      type: Number,
      min: 0,
      default: 0,
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
    furnishing: {
      type: String,
      enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
    },
    propertyAge: {
      type: String,
      enum: ['New Construction', 'Less than 1 year', '1-5 years', '5-10 years', '10-15 years', '15+ years'],
    },
    possessionStatus: {
      type: String,
      enum: ['Ready to Move', 'Under Construction'],
    },
    availableFrom: {
      type: String,
    },
    facing: {
      type: String,
      enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'],
    },
    waterElectricity: {
      type: String,
      enum: ['24x7 Available', 'Limited Hours', 'Frequent Cuts', 'No Issues'],
    },
    priceNegotiable: {
      type: Boolean,
      default: false,
    },
    maintenanceCharges: {
      type: Number,
      min: 0,
    },
    securityDeposit: {
      type: Number,
      min: 0,
    },
    ownershipType: {
      type: String,
      enum: ['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney'],
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
      locality: {
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
      projectName: {
        type: String,
      },
      floorNumber: {
        type: String,
      },
      landmark: {
        type: String,
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
    virtualTourUrl: {
      type: String,
    },
    floorPlans: {
      type: [
        {
          name: String,
          image: String,
          description: String,
        },
      ],
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
      email: {
        type: String,
      },
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
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