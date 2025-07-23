import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
// DELETE /api/users/favorites/agents/:agentId - Remove an agent from favorites
export const DELETE = withAuth(async (request, userId) => {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const agentId = pathSegments[pathSegments.length - 1];
    if (!agentId || agentId == "agents") {
        return NextResponse.json({ error: "Agent Id required!!" }, { status: 400 });
    }
    try {
        await connectDB();
        // Remove agent from user's favorites
        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { 'favorites.agents': agentId } }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Agent removed from favorites'
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while removing agent from favorites' }, { status: 500 });
    }
});
