import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
// POST /api/projects/[id]/favorite - Toggle favorite status
export const POST = withAuth(async (request, userId) => {
    var _a, _b;
    try {
        await connectDB();
        // Extract project ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const projectId = pathSegments[2]; // projects/[id]/favorite - id is at index 2
        // Find the user and check if project is already in favorites
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        const isFavorited = (_b = (_a = user.favorites) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.includes(projectId);
        if (isFavorited) {
            // Remove from favorites
            await User.findByIdAndUpdate(userId, {
                $pull: { 'favorites.properties': projectId }
            });
            // Decrement project favorites count
            await Project.findByIdAndUpdate(projectId, {
                $inc: { favorites: -1 }
            });
            return NextResponse.json({
                success: true,
                favorited: false,
                message: 'Removed from favorites',
            }, { status: 200 });
        }
        else {
            // Add to favorites
            await User.findByIdAndUpdate(userId, {
                $addToSet: { 'favorites.properties': projectId }
            });
            // Increment project favorites count
            await Project.findByIdAndUpdate(projectId, {
                $inc: { favorites: 1 }
            });
            return NextResponse.json({
                success: true,
                favorited: true,
                message: 'Added to favorites',
            }, { status: 200 });
        }
    }
    catch (error) {
        console.error('Error toggling favorite:', error);
        return NextResponse.json({ success: false, error: 'Failed to update favorites' }, { status: 500 });
    }
});
