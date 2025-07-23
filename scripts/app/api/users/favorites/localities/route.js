import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
// GET /api/users/favorites/localities - Get all favorite localities for current user
export const GET = withAuth(async (request, userId) => {
    var _a;
    try {
        await connectDB();
        // Get user with localities
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // For localities, we just return the list of locality names since they might not be their own model
        return NextResponse.json({
            favorites: ((_a = user.favorites) === null || _a === void 0 ? void 0 : _a.localities) || [],
            success: true
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching favorite localities' }, { status: 500 });
    }
});
// POST /api/users/favorites/localities - Add a locality to favorites
export const POST = withAuth(async (request, userId) => {
    try {
        const { localityId } = await request.json();
        if (!localityId) {
            return NextResponse.json({ error: 'Locality ID is required' }, { status: 400 });
        }
        await connectDB();
        // Add to user's favorite localities
        const updatedUser = await User.findByIdAndUpdate(userId, { $addToSet: { 'favorites.localities': localityId } }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Locality added to favorites'
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while adding locality to favorites' }, { status: 500 });
    }
});
