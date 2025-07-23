import mongoose, { Schema, models } from 'mongoose';
const savedSearchSchema = new Schema({
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
}, {
    timestamps: true,
});
const SavedSearch = models.SavedSearch || mongoose.model('SavedSearch', savedSearchSchema);
export default SavedSearch;
