import mongoose, { Schema } from "mongoose";
// userScchema
const userSchema = new Schema({
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
}, {
    timestamps: true,
});
// Check if model exists already to prevent recompiling during hot reload in development
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
