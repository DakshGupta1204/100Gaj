import mongoose, { Schema } from 'mongoose';
const CommercialPropertySchema = new Schema({
    title: {
        type: String,
        required: [true, 'Property title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Property description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        zipCode: {
            type: String,
            required: [true, 'Zip code is required'],
            trim: true
        },
        coordinates: {
            type: [Number],
            required: [true, 'Coordinates are required'],
            validate: {
                validator: function (v) {
                    return v.length === 2;
                },
                message: 'Coordinates must be an array of [longitude, latitude]'
            }
        }
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required'],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one image is required'
        }
    },
    propertyType: {
        type: String,
        required: [true, 'Property type is required'],
        enum: {
            values: ["Office", "Retail", "Warehouse", "Mixed Use", "Industrial"],
            message: 'Property type must be one of: Office, Retail, Warehouse, Mixed Use, Industrial'
        }
    },
    totalArea: {
        type: Number,
        required: [true, 'Total area is required'],
        min: [1, 'Total area must be greater than 0']
    },
    builtYear: {
        type: Number,
        required: [true, 'Built year is required'],
        min: [1900, 'Built year must be after 1900'],
        max: [new Date().getFullYear() + 5, 'Built year cannot be more than 5 years in the future']
    },
    developer: {
        name: {
            type: String,
            required: [true, 'Developer name is required'],
            trim: true
        },
        rating: {
            type: Number,
            required: [true, 'Developer rating is required'],
            min: [1, 'Rating must be between 1 and 5'],
            max: [5, 'Rating must be between 1 and 5']
        },
        projectsCompleted: {
            type: Number,
            required: [true, 'Projects completed count is required'],
            min: [0, 'Projects completed cannot be negative']
        }
    },
    totalPropertyValue: {
        type: Number,
        required: [true, 'Total property value is required'],
        min: [1, 'Total property value must be greater than 0']
    },
    totalShares: {
        type: Number,
        required: [true, 'Total shares is required'],
        min: [1, 'Total shares must be greater than 0']
    },
    availableShares: {
        type: Number,
        required: [true, 'Available shares is required'],
        min: [0, 'Available shares cannot be negative'],
        validate: {
            validator: function (v) {
                return v <= this.totalShares;
            },
            message: 'Available shares cannot exceed total shares'
        }
    },
    pricePerShare: {
        type: Number,
        required: [true, 'Price per share is required'],
        min: [1, 'Price per share must be greater than 0']
    },
    minInvestment: {
        type: Number,
        required: [true, 'Minimum investment is required'],
        min: [1, 'Minimum investment must be greater than 0']
    },
    currentROI: {
        type: Number,
        required: [true, 'Current ROI is required'],
        min: [0, 'ROI cannot be negative'],
        max: [100, 'ROI cannot exceed 100%']
    },
    rentalYield: {
        type: Number,
        required: [true, 'Rental yield is required'],
        min: [0, 'Rental yield cannot be negative'],
        max: [100, 'Rental yield cannot exceed 100%']
    },
    appreciationRate: {
        type: Number,
        required: [true, 'Appreciation rate is required'],
        min: [0, 'Appreciation rate cannot be negative'],
        max: [100, 'Appreciation rate cannot exceed 100%']
    },
    currentOccupancy: {
        type: Number,
        required: [true, 'Current occupancy is required'],
        min: [0, 'Occupancy cannot be negative'],
        max: [100, 'Occupancy cannot exceed 100%']
    },
    monthlyRental: {
        type: Number,
        required: [true, 'Monthly rental is required'],
        min: [0, 'Monthly rental cannot be negative']
    },
    spvId: {
        type: String,
        required: [true, 'SPV ID is required'],
        trim: true,
        unique: true
    },
    spvName: {
        type: String,
        required: [true, 'SPV name is required'],
        trim: true
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: {
            values: ["active", "sold_out", "coming_soon"],
            message: 'Status must be one of: active, sold_out, coming_soon'
        },
        default: "active"
    },
    featured: {
        type: Boolean,
        default: false
    },
    amenities: {
        type: [String],
        default: []
    },
    nearbyLandmarks: {
        type: [String],
        default: []
    },
    documents: [{
            name: {
                type: String,
                required: [true, 'Document name is required'],
                trim: true
            },
            url: {
                type: String,
                required: [true, 'Document URL is required'],
                trim: true
            },
            type: {
                type: String,
                required: [true, 'Document type is required'],
                enum: {
                    values: ["legal", "financial", "technical"],
                    message: 'Document type must be one of: legal, financial, technical'
                }
            }
        }]
}, {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
    collection: 'commercialProperties' // Explicitly set collection name
});
// Add indexes for better query performance
CommercialPropertySchema.index({ location: 1 });
CommercialPropertySchema.index({ propertyType: 1 });
CommercialPropertySchema.index({ status: 1 });
CommercialPropertySchema.index({ featured: 1 });
CommercialPropertySchema.index({ currentROI: -1 });
CommercialPropertySchema.index({ rentalYield: -1 });
CommercialPropertySchema.index({ pricePerShare: 1 });
CommercialPropertySchema.index({ 'address.city': 1 });
// Ensure the model is not redefined during hot reloads in development
const CommercialProperty = mongoose.models.CommercialProperty || mongoose.model('CommercialProperty', CommercialPropertySchema);
export default CommercialProperty;
