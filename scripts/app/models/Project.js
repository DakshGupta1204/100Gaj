import mongoose, { Schema, models } from 'mongoose';
const projectSchema = new Schema({
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
                validator: function (v) {
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
}, {
    timestamps: true,
});
// Add text index for search
projectSchema.index({
    projectName: 'text',
    developerDescription: 'text',
    locality: 'text',
    city: 'text'
});
// Add geospatial index
projectSchema.index({ coordinates: '2dsphere' });
const Project = models.Project || mongoose.model('Project', projectSchema);
export default Project;
