import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Favorite from '@/app/models/Favorite';
import Property from '@/app/models/Property';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';

// GET /api/users/favorites - Get all favorites for current user
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    // Parse query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get favorites with populated property details
    const favorites = await Favorite.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'property',
        select: 'title price propertyType listingType bedrooms bathrooms area images address status'
      });
    
    // Total count for pagination
    const total = await Favorite.countDocuments({ user: userId });
    
    return NextResponse.json({
      favorites,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching favorites' },
      { status: 500 }
    );
  }
});

// POST /api/users/favorites - Add a property to favorites
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const { propertyId } = await request.json();
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }
    
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
    });
    
    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Property is already in favorites' },
        { status: 400 }
      );
    }
    
    // Add to favorites
    const favorite = new Favorite({
      user: userId,
      property: propertyId,
    });
    
    await favorite.save();
    
    // Increment property favorites count
    await Property.findByIdAndUpdate(propertyId, {
      $inc: { favorites: 1 },
    });
    
    // Also add to User's favorites.properties array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { 'favorites.properties': propertyId }
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Property added to favorites',
        favorite,
      },
      { status: 201 }
    );
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while adding to favorites' },
      { status: 500 }
    );
  }
}); 