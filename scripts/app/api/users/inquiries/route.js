import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Inquiry from '@/app/models/Inquiry';
import { withAuth } from '@/app/lib/auth-middleware';
// GET /api/users/inquiries - Get all inquiries for the current user
export const GET = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Determine inquiry type (sent or received)
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type') || 'received'; // Default to received
        // Validation
        if (type !== 'sent' && type !== 'received') {
            return NextResponse.json({ error: 'Invalid inquiry type. Must be "sent" or "received"' }, { status: 400 });
        }
        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        // Status filter
        const status = searchParams.get('status');
        const statusFilter = status ? { status } : {};
        // Query based on type
        const query = type === 'sent'
            ? Object.assign({ sender: userId }, statusFilter) : Object.assign({ receiver: userId }, statusFilter);
        // Get inquiries with populated information
        const inquiries = await Inquiry.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('property', 'title images address price listingType propertyType')
            .populate(type === 'sent' ? 'receiver' : 'sender', 'name email');
        // Total count for pagination
        const total = await Inquiry.countDocuments(query);
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
