import mongoose, { Schema, models } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  googleId?: string;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  phone?: string;
  role: string; // user, agent, admin, builder
  admin?: boolean; // Admin privileges flag
  bio?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  // Agent specific fields
  isAgent?: boolean;
  agentInfo?: {
    licenseNumber?: string;
    agency?: string;
    experience?: number; // years
    specializations?: string[];
    languages?: string[];
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    listings?: number; // count of active listings
    sales?: number; // count of completed sales/rentals
    assignedProperties: mongoose.Types.ObjectId[];
  };
  
  // Builder specific fields
  isBuilder?: boolean;
  builderInfo?: {
    companyName?: string;
    licenseNumber?: string;
    reraId?: string;
    established?: Date;
    experience?: number; // years
    specializations?: string[];
    completedProjects?: number;
    ongoingProjects?: number;
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    projects?: mongoose.Types.ObjectId[];
  };
  
  // Social media links
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };    // User favorites
    favorites?: {
      properties?: mongoose.Types.ObjectId[];
      agents?: mongoose.Types.ObjectId[];
      builders?: mongoose.Types.ObjectId[];
      projects?: mongoose.Types.ObjectId[];
      localities?: string[]; // IDs or names of localities
    };
  // User properties (listings)
  properties?: mongoose.Types.ObjectId[]; // references to properties owned/listed by user
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    marketingEmails?: boolean;
  };
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allow null for non-Google users
    },

    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: Date,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "agent", "admin", "builder"],
      default: "user",
    },
    admin: {
      type: Boolean,
      default: false,
    },
    bio: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: "India",
      },
    },
    isAgent: {
      type: Boolean,
      default: false,
    },
    agentInfo: {
      licenseNumber: String,
      agency: String,
      experience: Number,
      specializations: [String],
      languages: [String],
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
      verified: {
        type: Boolean,
        default: false,
      },
      listings: {
        type: Number,
        default: 0,
      },
      sales: {
        type: Number,
        default: 0,
      },
      assignedProperties: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
      ],
    },
    isBuilder: {
      type: Boolean,
      default: false,
    },
    builderInfo: {
      companyName: String,
      licenseNumber: String,
      reraId: String,
      established: Date,
      experience: Number,
      specializations: [String],
      completedProjects: {
        type: Number,
        default: 0,
      },
      ongoingProjects: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
      verified: {
        type: Boolean,
        default: false,
      },
      projects: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        },
      ],
    },
    social: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },
    // Add user favorites
    favorites: {
      properties: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
      ],
      agents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      builders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Builder",
        },
      ],
      projects: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        },
      ],
      localities: [String],
    },
    // User's properties/listings
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
    },
    lastActive: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Check if model exists already to prevent recompiling during hot reload in development
const User = models.User || mongoose.model<IUser>("User", userSchema, "ad equity users");

export default User;
