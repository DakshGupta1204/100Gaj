import mongoose, { Schema, models } from 'mongoose';
const agentScheduleSchema = new Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    availability: [{
            dayOfWeek: {
                type: Number,
                required: true,
                min: 0,
                max: 6,
            },
            startTime: {
                type: String,
                required: true,
                match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            },
            endTime: {
                type: String,
                required: true,
                match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            },
        }],
    blockedDates: [{
            date: {
                type: Date,
                required: true,
            },
            reason: String,
        }],
    appointments: [{
            date: {
                type: Date,
                required: true,
            },
            startTime: {
                type: String,
                required: true,
                match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            },
            endTime: {
                type: String,
                required: true,
                match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            },
            client: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            property: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Property',
            },
            status: {
                type: String,
                enum: ['pending', 'confirmed', 'cancelled', 'completed'],
                default: 'pending',
            },
            type: {
                type: String,
                enum: ['property-viewing', 'consultation', 'other'],
                required: true,
            },
            notes: String,
        }],
}, {
    timestamps: true,
});
// Create indexes for efficient querying
agentScheduleSchema.index({ 'appointments.date': 1 });
agentScheduleSchema.index({ 'appointments.client': 1 });
agentScheduleSchema.index({ 'appointments.property': 1 });
const AgentSchedule = models.AgentSchedule || mongoose.model('AgentSchedule', agentScheduleSchema);
export default AgentSchedule;
