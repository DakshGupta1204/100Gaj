import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';

// GET /api/users/favorites/agents - Get all favorite agents for current user
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    // Get user with populated agent favorites
    const user = await User.findById(userId)
      .populate({
        path: 'favorites.agents',
        select: 'name email phone image bio isAgent agentInfo address social lastActive'
      });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favorites: user.favorites?.agents || [],
      success: true
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching favorite agents' },
      { status: 500 }
    );
  }
});

// POST /api/users/favorites/agents - Add an agent to favorites
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const { agentId } = await request.json();
    
    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }
    
    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if agent exists
    const agent = await User.findOne({ _id: agentId, isAgent: true });
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    // Add to user's favorite agents
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { 'favorites.agents': agentId } },
      { new: true }
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Agent added to favorites'
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while adding agent to favorites' },
      { status: 500 }
    );
  }
}); 