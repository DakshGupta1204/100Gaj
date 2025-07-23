import mongoose, { Schema, models } from "mongoose";


interface IUser {
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  isVerified?: boolean;
  googleId?: string;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  phone?: string;
  role: string; // landlord, tenant
  bio?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  // Social media links
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };

  // User favorites
  favorites?: {
    properties?: mongoose.Types.ObjectId[];
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





// userScchema
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
    isVerified: {
  type: Boolean,
  default: false,
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
      enum: ["landlord", "tenant"],
      default: "tenant",
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
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
const User = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", userSchema);


export default User;
