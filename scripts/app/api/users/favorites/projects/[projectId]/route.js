import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Project from '@/app/models/Project';
import { withAuth } from '@/app/lib/auth-middleware';
// DELETE /api/users/favorites/projects/:projectId
export const DELETE = withAuth(async (req, userId) => {
    // Extract projectId from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const projectId = pathParts[pathParts.length - 1];
    if (!projectId || projectId === "projects") {
        return NextResponse.json({ error: "Project ID required!" }, { status: 400 });
    }
    try {
        await connectDB();
        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { 'favorites.projects': projectId } }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Decrement project favorites count
        await Project.findByIdAndUpdate(projectId, { $inc: { favorites: -1 } });
        return NextResponse.json({
            success: true,
            message: 'Project removed from favorites'
        });
    }
    catch (error) {
        console.error('Error removing project from favorites:', error);
        return NextResponse.json({ error: 'An error occurred while removing project from favorites' }, { status: 500 });
    }
});
