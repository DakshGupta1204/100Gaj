import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Inquiry from '@/app/models/Inquiry';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// GET /api/inquiries/[id] - Get a specific inquiry
export const GET = withAuth(async (request, userId) => {
    try {
        // Extract inquiry ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const inquiryId = pathSegments[pathSegments.length - 1]; // Last segment is the inquiry ID
        if (!isValidObjectId(inquiryId)) {
            return NextResponse.json({ error: 'Invalid inquiry ID format' }, { status: 400 });
        }
        await connectDB();
        // Find inquiry
        const inquiry = await Inquiry.findById(inquiryId)
            .populate('property', 'title images address price listingType propertyType')
            .populate('sender', 'name email phone')
            .populate('receiver', 'name email phone');
        if (!inquiry) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }
        // Check authorization (must be sender or receiver)
        if (inquiry.sender.toString() !== userId && inquiry.receiver.toString() !== userId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        // If receiver is viewing, mark as read if it's new
        if (inquiry.receiver.toString() === userId && inquiry.status === 'new') {
            inquiry.status = 'read';
            await inquiry.save();
        }
        return NextResponse.json(inquiry);
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching the inquiry' }, { status: 500 });
    }
});
// PATCH /api/inquiries/[id] - Update inquiry status
export const PATCH = withAuth(async (request, userId) => {
    try {
        // Extract inquiry ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const inquiryId = pathSegments[pathSegments.length - 1]; // Last segment is the inquiry ID
        const { status } = await request.json();
        if (!isValidObjectId(inquiryId)) {
            return NextResponse.json({ error: 'Invalid inquiry ID format' }, { status: 400 });
        }
        // Validate status
        const validStatuses = ['new', 'read', 'replied', 'closed'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: `Status must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
        }
        await connectDB();
        // Find inquiry
        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }
        // Only the receiver can update the status
        if (inquiry.receiver.toString() !== userId) {
            return NextResponse.json({ error: 'Access denied. Only the receiver can update the status' }, { status: 403 });
        }
        // Update status
        inquiry.status = status;
        await inquiry.save();
        return NextResponse.json({
            success: true,
            message: 'Inquiry status updated successfully',
            inquiry,
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while updating the inquiry' }, { status: 500 });
    }
});
// DELETE /api/inquiries/[id] - Delete an inquiry
export const DELETE = withAuth(async (request, userId) => {
    try {
        // Extract inquiry ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const inquiryId = pathSegments[pathSegments.length - 1]; // Last segment is the inquiry ID
        if (!isValidObjectId(inquiryId)) {
            return NextResponse.json({ error: 'Invalid inquiry ID format' }, { status: 400 });
        }
        await connectDB();
        // Find inquiry
        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }
        // Only sender or receiver can delete
        if (inquiry.sender.toString() !== userId && inquiry.receiver.toString() !== userId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        // Delete inquiry
        await Inquiry.findByIdAndDelete(inquiryId);
        return NextResponse.json({
            success: true,
            message: 'Inquiry deleted successfully',
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while deleting the inquiry' }, { status: 500 });
    }
});
