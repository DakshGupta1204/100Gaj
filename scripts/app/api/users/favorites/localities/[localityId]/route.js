import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
// DELETE /api/users/favorites/localities/:localityId - Remove a locality from favorites
export const DELETE = withAuth(async (request, userId) => {
    // Extract localityId from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const localityId = pathSegments[pathSegments.length - 1]; // Get the last segment
    try {
        await connectDB();
        // Remove locality from user's favorites
        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { 'favorites.localities': localityId } }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Locality removed from favorites'
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while removing locality from favorites' }, { status: 500 });
    }
});
