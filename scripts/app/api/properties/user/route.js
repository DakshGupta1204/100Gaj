import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// Helper function to get properties for authenticated user
export const GET = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Find all properties owned by this user
        const properties = await Property.find({ owner: new mongoose.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .select('-__v');
        return NextResponse.json({
            success: true,
            count: properties.length,
            properties
        }, { status: 200 });
    }
    catch (_error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch properties'
        }, { status: 500 });
    }
});
