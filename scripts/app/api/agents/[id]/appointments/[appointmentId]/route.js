import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import AgentSchedule from '@/app/models/AgentSchedule';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// PATCH /api/agents/[id]/appointments/[appointmentId] - Update appointment status
export const PATCH = withAuth(async (request, userId) => {
    try {
        const urlParts = request.url.split('/');
        const appointmentId = urlParts[urlParts.length - 1];
        const agentId = urlParts[urlParts.length - 3];
        const { status } = await request.json();
        if (!agentId || !isValidObjectId(agentId) || !appointmentId || !isValidObjectId(appointmentId)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }
        // Validate status
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: `Status must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
        }
        await connectDB();
        // Find schedule and appointment
        const schedule = await AgentSchedule.findOne({ agent: agentId });
        if (!schedule) {
            return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
        }
        const appointment = schedule.appointments.id(appointmentId);
        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }
        // Check authorization
        if (agentId !== userId && appointment.client.toString() !== userId) {
            return NextResponse.json({ error: 'You do not have permission to update this appointment' }, { status: 403 });
        }
        // Apply status update rules
        if (appointment.status === 'cancelled' || appointment.status === 'completed') {
            return NextResponse.json({ error: 'Cannot update status of cancelled or completed appointments' }, { status: 400 });
        }
        // Only agent can confirm or complete appointments
        if ((status === 'confirmed' || status === 'completed') && agentId !== userId) {
            return NextResponse.json({ error: 'Only the agent can confirm or complete appointments' }, { status: 403 });
        }
        // Update appointment status
        appointment.status = status;
        await schedule.save();
        return NextResponse.json({
            success: true,
            message: 'Appointment status updated successfully',
            appointment,
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while updating the appointment' }, { status: 500 });
    }
});
// DELETE /api/agents/[id]/appointments/[appointmentId] - Delete an appointment
export const DELETE = withAuth(async (request, userId) => {
    try {
        // Extract IDs from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const agentId = pathSegments[2]; // "agents" at 0, "id" at 1, actual ID at 2
        const appointmentId = pathSegments[4]; // "appointments" at 3, "appointmentId" at 4
        if (!isValidObjectId(agentId) || !isValidObjectId(appointmentId)) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }
        await connectDB();
        // Find schedule and appointment
        const schedule = await AgentSchedule.findOne({ agent: agentId });
        if (!schedule) {
            return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
        }
        const appointment = schedule.appointments.id(appointmentId);
        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }
        // Check authorization
        if (agentId !== userId && appointment.client.toString() !== userId) {
            return NextResponse.json({ error: 'You do not have permission to delete this appointment' }, { status: 403 });
        }
        // Don't allow deleting completed appointments
        if (appointment.status === 'completed') {
            return NextResponse.json({ error: 'Cannot delete completed appointments' }, { status: 400 });
        }
        // Remove appointment
        schedule.appointments.pull(appointmentId);
        await schedule.save();
        return NextResponse.json({
            success: true,
            message: 'Appointment deleted successfully',
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while deleting the appointment' }, { status: 500 });
    }
});
