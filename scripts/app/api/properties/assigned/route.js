import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// GET /api/properties/assigned - Get all properties assigned to the authenticated agent
export const GET = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Find all properties assigned to this agent
        const properties = await Property.find({
            agent: new mongoose.Types.ObjectId(userId),
            status: 'active'
        })
            .sort({ createdAt: -1 })
            .select('-__v')
            .populate('owner', 'name email phone');
        return NextResponse.json({
            success: true,
            count: properties.length,
            properties
        }, { status: 200 });
    }
    catch (_error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch assigned properties'
        }, { status: 500 });
    }
});
