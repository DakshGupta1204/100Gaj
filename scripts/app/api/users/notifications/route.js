import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Notification from '@/app/models/Notification';
import { withAuth } from '@/app/lib/auth-middleware';
import { isValidObjectId } from 'mongoose';
// GET /api/users/notifications
export const GET = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;
        const unreadOnly = searchParams.get('unread') === 'true';
        const type = searchParams.get('type');
        // Build query
        const query = { user: userId };
        if (unreadOnly) {
            query.read = false;
        }
        if (type) {
            query.type = type;
        }
        // Get notifications without population for now
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        // Get total count
        const total = await Notification.countDocuments(query);
        // Get unread count
        const unreadCount = await Notification.countDocuments({
            user: userId,
            read: false,
        });
        return NextResponse.json({
            notifications,
            unreadCount,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching notifications' }, { status: 500 });
    }
});
// POST /api/users/notifications
export const POST = withAuth(async (request, userId) => {
    try {
        const { type, title, message, data } = await request.json();
        // Validate required fields
        if (!type || !title || !message) {
            return NextResponse.json({ error: 'Type, title, and message are required' }, { status: 400 });
        }
        await connectDB();
        // Validate ObjectId fields in data if present
        const validatedData = Object.assign({}, data);
        if (data) {
            // Check and clean ObjectId fields
            const objectIdFields = ['propertyId', 'inquiryId', 'appointmentId', 'reviewId', 'agentId'];
            for (const field of objectIdFields) {
                if (data[field] && !isValidObjectId(data[field])) {
                    // Remove invalid ObjectIds to prevent MongoDB casting errors
                    delete validatedData[field];
                }
            }
        }
        // Create notification
        const notification = new Notification({
            user: userId,
            type,
            title,
            message,
            data: validatedData,
        });
        await notification.save();
        return NextResponse.json({
            success: true,
            message: 'Notification created successfully',
            notification,
        }, { status: 201 });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while creating the notification' }, { status: 500 });
    }
});
// PATCH /api/users/notifications
export const PATCH = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Update all unread notifications for the user
        const result = await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });
        return NextResponse.json({
            success: true,
            message: 'All notifications marked as read',
            count: result.modifiedCount,
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while marking notifications as read' }, { status: 500 });
    }
});
