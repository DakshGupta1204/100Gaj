import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
// DELETE /api/users/favorites/builders/:builderId
export const DELETE = withAuth(async (req, userId) => {
    // Extract builderId from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const builderId = pathParts[pathParts.length - 1];
    if (!builderId || builderId == "builders") {
        return NextResponse.json({ error: "Builder Id required!!" }, { status: 400 });
    }
    try {
        await connectDB();
        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { 'favorites.builders': builderId } }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Builder removed from favorites',
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while removing builder from favorites' }, { status: 500 });
    }
});
