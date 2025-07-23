import mongoose, { Schema } from 'mongoose';
// Builder schema
const BuilderSchema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    logo: { type: String, required: true },
    projects: { type: Number, required: true },
    description: { type: String, required: true },
    established: { type: String, required: true },
    headquarters: { type: String, required: true },
    specialization: { type: String, required: true },
    rating: { type: Number, required: true },
    completed: { type: Number, required: true },
    ongoing: { type: Number, required: true },
    about: { type: String },
    projects_list: [
        {
            name: { type: String, required: true },
            location: { type: String, required: true },
            status: { type: String, enum: ['Completed', 'Ongoing'], required: true },
            type: { type: String, required: true }
        }
    ],
    reviews: [
        {
            user: { type: String, required: true },
            rating: { type: Number, required: true, min: 0, max: 5 },
            date: { type: String, required: true },
            text: { type: String, required: true }
        }
    ],
    contact: {
        email: { type: String },
        phone: { type: String },
        website: { type: String },
        address: { type: String }
    }
}, {
    timestamps: true
});
// Create and export the Builder model
export default mongoose.models.Builder || mongoose.model('Builder', BuilderSchema);
