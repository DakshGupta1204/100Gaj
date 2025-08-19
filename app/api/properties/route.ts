import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';

import { withAuth } from '@/app/lib/auth-middleware';
import { connectToDB } from '@/app/lib/mongoose';

// GET /api/properties - Get all properties (with pagination and filtering)
export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are loaded
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json({ 
        success: false, 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    await connectToDB();
    
    // Extract query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const propertyType = searchParams.get('propertyType');
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Build query based on filters
    const query: any = { status: 'active' };
    
    if (propertyType) query.propertyType = propertyType;
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (locality) query['address.locality'] = { $regex: locality, $options: 'i' };
    if (minPrice) query.price = { ...query.price, $gte: parseInt(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice) };
    
    // Find properties based on the query
    const properties = await Property.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    return NextResponse.json({ 
      success: true, 
      count: properties.length,
      properties
    }, { status: 200 });
  } catch (error) {
    console.error('Properties API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch properties',
      details: process.env.NODE_ENV === 'development' ? error : error
    }, { status: 500 });
  }
}

// POST /api/properties - Create a new property listing
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'propertyType', 'listingType', 'area', 'address', 'images'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Handle address required fields
    if (!data.address) {
      return NextResponse.json(
        { error: 'Address must include street, city, locality, and state' },
        { status: 400 }
      );
    }
    if (!data.address.state) {
      data.address.state = 'Delhi'; // Default state
    }
    // Set default zipCode if not provided
    if (!data.address.zipCode) {
      data.address.zipCode = '110001'; // Default Delhi zipcode
    }
    
    // If address location coordinates are not provided, use default ones
    if (!data.address.location || !data.address.location.coordinates) {
      data.address.location = {
        type: 'Point',
        coordinates: [77.1025, 28.7041] // Default Delhi coordinates
      };
    }
    
    // Create property object with defaults for any missing fields
    const propertyData = {
      ...data,
      owner: userId, // Use the authenticated user's ID as the owner
      status: data.status || 'active',
      views: 0,
      favorites: 0,
      verified: false,
      // Set defaults for optional fields that are required by the model
      amenities: data.amenities || [],
      features: data.features || [],
      furnished: data.furnished || false,
      balconyCount: data.balconyCount || 0,
      priceNegotiable: data.priceNegotiable || false,
      ownerDetails: {
        name: data.ownerDetails.name,
        phone: data.ownerDetails.phone,
        email: data.ownerDetails.email || null
      }
    };
    
    // Create new property
    const property = new Property(propertyData);
    
    await property.save();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Property created successfully',
        property,
      },
      { status: 201 }
    );
    
  } catch (error: any) {

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while creating the property' },
      { status: 500 }
    );
  }
});

// Original POST handler with authentication (commented out for now)
/*
// Helper function to handle property creation
async function createProperty(request: NextRequest, userId: string) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'propertyType', 'listingType', 'area', 'address', 'images'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // If address location coordinates are not provided, use default ones for now
    // In a real application, you would use a geocoding service
    if (!data.address.location || !data.address.location.coordinates) {
      data.address.location = {
        type: 'Point',
        coordinates: [0, 0] // Default coordinates (would normally come from geocoding)
      };
    }
    
    // Create new property
    const property = new Property({
      ...data,
      owner: userId, // Set the current user as the owner
      status: data.status || 'active', // Default to active if not specified
    });
    
    await property.save();
    
    // Update subscription usage count
    const subscription = await Subscription.findOne({
      user: userId,
      isActive: true
    });
    
    if (subscription) {
      subscription.listings.used += 1;
      await subscription.save();
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Property created successfully',
        property,
      },
      { status: 201 }
    );
  } catch (error: any) {

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while creating the property' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property listing
// Use withAuthAndSubscription middleware to check if user has an active subscription
// and is allowed to create listings based on their plan
export const POST = withAuthAndSubscription(
  createProperty,
  'create_listing',
  [UserType.OWNER, UserType.DEALER],
  PlanType.FREE
); 
*/ 