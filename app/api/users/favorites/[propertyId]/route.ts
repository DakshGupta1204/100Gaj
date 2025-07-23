import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Favorite from '@/app/models/Favorite';
import Property from '@/app/models/Property';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';

// DELETE /api/users/favorites/:propertyId - Remove a property from favorites
export const DELETE = withAuth(async (request: NextRequest, userId: string) => {
  const url = new URL(request.url);
  const propertyId = url.pathname.split('/').pop();
  
  try {
    await connectDB();
    
    // Find and delete the favorite
    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      property: propertyId,
    });
    
    if (!favorite) {
      return NextResponse.json(
        { error: 'Property not found in favorites' },
        { status: 404 }
      );
    }
    
    // Decrement property favorites count
    await Property.findByIdAndUpdate(propertyId, {
      $inc: { favorites: -1 },
    });
    
    // Also remove from User's favorites array
    await User.findByIdAndUpdate(userId, {
      $pull: { 'favorites.properties': propertyId }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Property removed from favorites',
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while removing from favorites' },
      { status: 500 }
    );
  }
}); 