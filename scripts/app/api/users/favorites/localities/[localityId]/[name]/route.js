import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import FavoriteLocality from '@/app/models/FavoriteLocality';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
// DELETE /api/users/favorites/localities/[localityId] - Remove a locality from favorites
export const DELETE = withAuth(async (request, userId) => {
    try {
        // Extract localityId from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const localityId = pathSegments[pathSegments.length - 1]; // Get the last segment
        if (!localityId) {
            return NextResponse.json({ error: 'Locality name is required' }, { status: 400 });
        }
        // URL decode the name parameter which might contain spaces, etc.
        const decodedName = decodeURIComponent(localityId);
        await connectDB();
        // Find and delete the favorite
        const deletedFavorite = await FavoriteLocality.findOneAndDelete({
            user: userId,
            name: decodedName,
        });
        if (!deletedFavorite) {
            return NextResponse.json({ error: 'Favorite locality not found' }, { status: 404 });
        }
        // Also update the user's favorites.localities array
        await User.findByIdAndUpdate(userId, {
            $pull: { 'favorites.localities': decodedName }
        });
        return NextResponse.json({
            success: true,
            message: 'Locality removed from favorites',
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while removing locality from favorites' }, { status: 500 });
    }
});
