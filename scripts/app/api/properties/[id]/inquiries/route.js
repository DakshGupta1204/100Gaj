import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';
import Inquiry from '@/app/models/Inquiry';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// POST /api/properties/[id]/inquiries - Create a new inquiry for a property
export const POST = withAuth(async (request, userId) => {
    try {
        // Extract property ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const propertyId = pathSegments[pathSegments.length - 1]; // Last segment is the property ID
        const { message, phone } = await request.json();
        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
        }
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }
        await connectDB();
        // Find the property
        const property = await Property.findById(propertyId);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        // Don't allow inquiries to your own property
        if (property.owner.toString() === userId) {
            return NextResponse.json({ error: 'You cannot send an inquiry to your own property' }, { status: 400 });
        }
        // Get sender details
        const sender = await mongoose.model('User').findById(userId);
        if (!sender) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Create the inquiry
        const inquiry = new Inquiry({
            property: propertyId,
            sender: userId,
            receiver: property.owner,
            message,
            phone: phone || sender.phone, // Use provided phone or user's default
            email: sender.email,
            status: 'new',
        });
        await inquiry.save();
        // Optionally send notification (email, push, etc.) to property owner
        // This would be implemented in a separate service
        return NextResponse.json({
            success: true,
            message: 'Inquiry sent successfully',
            inquiry: {
                id: inquiry._id,
                property: propertyId,
                message: inquiry.message,
                createdAt: inquiry.createdAt,
            },
        }, { status: 201 });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while creating the inquiry' }, { status: 500 });
    }
});
// GET /api/properties/[id]/inquiries - Get inquiries for a specific property (owner only)
export const GET = withAuth(async (request, userId) => {
    try {
        // Extract property ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const propertyId = pathSegments[pathSegments.length - 1]; // Last segment is the property ID
        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
        }
        await connectDB();
        // Find the property
        const property = await Property.findById(propertyId);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        // Only the property owner or agent can see inquiries
        if (property.owner.toString() !== userId &&
            (!property.agent || property.agent.toString() !== userId)) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        // Parse query parameters for pagination
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        // Get inquiries
        const inquiries = await Inquiry.find({ property: propertyId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'name email phone');
        // Total count for pagination
        const total = await Inquiry.countDocuments({ property: propertyId });
        return NextResponse.json({
            inquiries,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching inquiries' }, { status: 500 });
    }
});
