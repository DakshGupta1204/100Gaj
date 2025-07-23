import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/app/models/User';
import { withAuthAndSubscription } from '@/app/lib/subscription-middleware';
import { UserType, PlanType } from '@/app/models/Subscription';
// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// Define SupportTicket model (importing from external schema would be better in a real app)
let SupportTicket;
try {
    SupportTicket = mongoose.model('SupportTicket');
}
catch (_error) {
    // This is just a fallback - in a real app, the model would be imported properly
    const supportTicketSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subject: { type: String, required: true },
        description: { type: String, required: true },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: 'open'
        },
        category: { type: String, required: true },
        attachments: [{ type: String }],
        responses: [{
                responder: { type: String, required: true },
                message: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                isAdmin: { type: Boolean, default: false }
            }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });
    SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
}
/**
 * GET /api/support/[id] - Get a specific support ticket
 * This endpoint requires a premium subscription with customer care feature
 */
async function getSupportTicket(request, userId) {
    try {
        await connectDB();
        // Extract ticket ID from URL
        const ticketId = request.url.split('/').pop();
        // Validate ticket ID
        if (!ticketId || !isValidObjectId(ticketId)) {
            return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
        }
        // Find ticket
        const ticket = await SupportTicket.findById(ticketId);
        if (!ticket) {
            return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
        }
        // Check if user owns this ticket
        if (ticket.user.toString() !== userId) {
            return NextResponse.json({ error: 'You do not have permission to view this ticket' }, { status: 403 });
        }
        return NextResponse.json({
            success: true,
            ticket
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching support ticket' }, { status: 500 });
    }
}
/**
 * PATCH /api/support/[id] - Update a support ticket or add a response
 * This endpoint requires a premium subscription with customer care feature
 */
async function updateSupportTicket(request, userId) {
    try {
        await connectDB();
        // Extract ticket ID from URL
        const ticketId = request.url.split('/').pop();
        // Validate ticket ID
        if (!ticketId || !isValidObjectId(ticketId)) {
            return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
        }
        // Find ticket
        const ticket = await SupportTicket.findById(ticketId);
        if (!ticket) {
            return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
        }
        // Check if user owns this ticket
        if (ticket.user.toString() !== userId) {
            return NextResponse.json({ error: 'You do not have permission to update this ticket' }, { status: 403 });
        }
        // Get request data
        const { priority, status, response } = await request.json();
        // Update ticket fields if provided
        if (priority && ['low', 'medium', 'high', 'urgent'].includes(priority)) {
            ticket.priority = priority;
        }
        // Users can only set status to 'closed'
        if (status === 'closed') {
            ticket.status = status;
        }
        // Add response if provided
        if (response && response.trim()) {
            // Get user details
            const user = await User.findById(userId);
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            ticket.responses.push({
                responder: user.name,
                message: response,
                timestamp: new Date(),
                isAdmin: false
            });
            // If ticket was resolved or closed and user adds a response, reopen it
            if (ticket.status === 'resolved' || ticket.status === 'closed') {
                ticket.status = 'open';
            }
        }
        // Update timestamp
        ticket.updatedAt = new Date();
        await ticket.save();
        return NextResponse.json({
            success: true,
            message: 'Support ticket updated successfully',
            ticket
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while updating support ticket' }, { status: 500 });
    }
}
/**
 * DELETE /api/support/[id] - Delete a support ticket
 * This endpoint requires a premium subscription with customer care feature
 */
async function deleteSupportTicket(request, userId) {
    try {
        await connectDB();
        // Extract ticket ID from URL
        const ticketId = request.url.split('/').pop();
        // Validate ticket ID
        if (!ticketId || !isValidObjectId(ticketId)) {
            return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
        }
        // Find ticket
        const ticket = await SupportTicket.findById(ticketId);
        if (!ticket) {
            return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 });
        }
        // Check if user owns this ticket
        if (ticket.user.toString() !== userId) {
            return NextResponse.json({ error: 'You do not have permission to delete this ticket' }, { status: 403 });
        }
        // Users can only delete tickets that are closed
        if (ticket.status !== 'closed') {
            return NextResponse.json({ error: 'Only closed tickets can be deleted. Please close the ticket first.' }, { status: 400 });
        }
        await SupportTicket.findByIdAndDelete(ticketId);
        return NextResponse.json({
            success: true,
            message: 'Support ticket deleted successfully'
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while deleting support ticket' }, { status: 500 });
    }
}
// Export the route handlers with authentication and subscription check
// Requires a premium subscription with customer care feature
export const GET = withAuthAndSubscription(getSupportTicket, 'customer_care', [UserType.OWNER, UserType.DEALER, UserType.BUYER], PlanType.PREMIUM // Requiring PREMIUM plan which has customer care
);
export const PATCH = withAuthAndSubscription(updateSupportTicket, 'customer_care', [UserType.OWNER, UserType.DEALER, UserType.BUYER], PlanType.PREMIUM);
export const DELETE = withAuthAndSubscription(deleteSupportTicket, 'customer_care', [UserType.OWNER, UserType.DEALER, UserType.BUYER], PlanType.PREMIUM);
