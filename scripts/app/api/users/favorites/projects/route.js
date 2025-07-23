import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Project from '@/app/models/Project';
import { withAuth } from '@/app/lib/auth-middleware';
// GET /api/users/favorites/projects - Get user's favorite projects
export const GET = withAuth(async (request, userId) => {
    var _a;
    try {
        await connectDB();
        const user = await User.findById(userId)
            .populate({
            path: 'favorites.projects',
            model: 'Project',
            select: 'projectName projectType propertyTypesOffered projectStage city locality projectAddress coordinates unitTypes possessionDate constructionStatus projectImages developer status verified views favorites inquiries createdAt',
            populate: {
                path: 'developer',
                model: 'User',
                select: 'name email'
            }
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            favorites: ((_a = user.favorites) === null || _a === void 0 ? void 0 : _a.projects) || []
        });
    }
    catch (error) {
        console.error('Error fetching favorite projects:', error);
        return NextResponse.json({ error: 'An error occurred while fetching favorite projects' }, { status: 500 });
    }
});
// POST /api/users/favorites/projects - Add project to favorites
export const POST = withAuth(async (request, userId) => {
    try {
        await connectDB();
        const { projectId } = await request.json();
        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }
        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        // Add to user's favorites
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { 'favorites.projects': projectId }
        }, { new: true, upsert: true });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Increment project favorites count
        await Project.findByIdAndUpdate(projectId, { $inc: { favorites: 1 } });
        return NextResponse.json({
            success: true,
            message: 'Project added to favorites'
        });
    }
    catch (error) {
        console.error('Error adding project to favorites:', error);
        return NextResponse.json({ error: 'An error occurred while adding project to favorites' }, { status: 500 });
    }
});
