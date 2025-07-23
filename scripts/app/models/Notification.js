import mongoose, { Schema, models } from 'mongoose';
const notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['property-alert', 'inquiry-update', 'appointment-update', 'review', 'system'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: {
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
        },
        inquiryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inquiry',
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
        agentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        url: String,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Create indexes for efficient querying
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
const Notification = models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
