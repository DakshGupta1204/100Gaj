import mongoose, { Schema, models } from 'mongoose';

interface IProject {
  projectName: string;
  projectType: string; // 'residential' | 'commercial' | 'mixed-use'
  propertyTypesOffered: string[];
  projectStage: string; // 'under-construction' | 'ready-to-move'
  reraRegistrationNo: string;
  reraDocument?: string;
  projectTagline: string;
  developerDescription: string;
  
  // Location & Connectivity
  city: string;
  locality: string;
  projectAddress: string;
  landmark?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distances?: {
    airport?: number;
    metro?: number;
    school?: number;
    hospital?: number;
    mall?: number;
  };
  
  // Configuration & Pricing
  unitTypes: {
    type: string; // '1BHK', '2BHK', etc.
    sizeRange: {
      min: number;
      max: number;
      unit: string; // 'sqft' | 'sqm'
    };
    priceRange: {
      min: number;
      max: number;
      perSqft?: number;
    };
  }[];
  paymentPlans: string[]; // 'CLP', 'Flexi', 'Subvention', etc.
  bookingAmount?: number;
  allInclusivePricing: boolean;
  possessionDate: Date;
  constructionStatus: string;
  
  // Amenities & Features
  projectAmenities: string[];
  unitSpecifications: string;
  greenCertifications: string[];
  projectUSPs: string[];
  
  // Media
  projectImages: string[];
  floorPlans: string[];
  siteLayout?: string;
  locationMap?: string;
  projectBrochure?: string;
  videoWalkthrough?: string;
  
  // Builder/Developer info
  developer: mongoose.Types.ObjectId;
  developerContact: {
    name: string;
    phone: string;
    email: string;
    affiliation?: string;
  };
  
  // Status and metadata
  status: string; // 'active', 'pending', 'approved', 'rejected'
  verified: boolean;
  views: number;
  favorites: number;
  inquiries: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    projectType: {
      type: String,
      required: true,
      enum: ['residential', 'commercial', 'mixed-use'],
    },
    propertyTypesOffered: {
      type: [String],
      required: true,
    },
    projectStage: {
      type: String,
      required: true,
      enum: ['under-construction', 'ready-to-move'],
    },
    reraRegistrationNo: {
      type: String,
      required: true,
    },
    reraDocument: {
      type: String,
    },
    projectTagline: {
      type: String,
      required: true,
      maxlength: 80,
    },
    developerDescription: {
      type: String,
      required: true,
    },
    
    // Location fields
    city: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    projectAddress: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    distances: {
      airport: Number,
      metro: Number,
      school: Number,
      hospital: Number,
      mall: Number,
    },
    
    // Configuration
    unitTypes: [{
      type: {
        type: String,
        required: true,
      },
      sizeRange: {
        min: {
          type: Number,
          required: true,
        },
        max: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
          default: 'sqft',
        },
      },
      priceRange: {
        min: {
          type: Number,
          required: true,
        },
        max: {
          type: Number,
          required: true,
        },
        perSqft: Number,
      },
    }],
    paymentPlans: [String],
    bookingAmount: Number,
    allInclusivePricing: {
      type: Boolean,
      default: false,
    },
    possessionDate: {
      type: Date,
      required: true,
    },
    constructionStatus: {
      type: String,
      required: true,
    },
    
    // Features
    projectAmenities: {
      type: [String],
      default: [],
    },
    unitSpecifications: {
      type: String,
    },
    greenCertifications: {
      type: [String],
      default: [],
    },
    projectUSPs: {
      type: [String],
      default: [],
    },
    
    // Media
    projectImages: {
      type: [String],
      required: true,
      validate: [
        {
          validator: function(v: string[]) {
            return v.length > 0;
          },
          message: 'At least one project image is required',
        },
      ],
    },
    floorPlans: {
      type: [String],
      default: [],
    },
    siteLayout: String,
    locationMap: String,
    projectBrochure: String,
    videoWalkthrough: String,
    
    // Developer info
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    developerContact: {
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
        required: true,
      },
      affiliation: String,
    },
    
    // Status
    status: {
      type: String,
      enum: ['active', 'pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
projectSchema.index({ 
  projectName: 'text',
  developerDescription: 'text',
  locality: 'text',
  city: 'text'
});

// Add geospatial index
projectSchema.index({ coordinates: '2dsphere' });

const Project = models.Project || mongoose.model<IProject>('Project', projectSchema);

export default Project;
