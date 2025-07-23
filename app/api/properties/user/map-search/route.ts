import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';

// GET /api/properties/map-search - Search properties within map boundaries
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    
    // Get boundary parameters
    const north = parseFloat(searchParams.get('north') || '90');  // Default to max lat
    const south = parseFloat(searchParams.get('south') || '-90'); // Default to min lat
    const east = parseFloat(searchParams.get('east') || '180');   // Default to max lng
    const west = parseFloat(searchParams.get('west') || '-180');  // Default to min lng
    
    if (isNaN(north) || isNaN(south) || isNaN(east) || isNaN(west)) {
      return NextResponse.json(
        { error: 'Invalid boundary parameters' },
        { status: 400 }
      );
    }
    
    // Build base query
    const query: any = {
      // Find properties with coordinates within the boundary
      'address.location': {
        $geoWithin: {
          $box: [
            [west, south], // Southwest corner [lng, lat]
            [east, north]  // Northeast corner [lng, lat]
          ]
        }
      },
      // Only show active listings by default
      status: 'active'
    };
    
    // Apply additional filters if provided
    if (searchParams.has('propertyType')) {
      query.propertyType = searchParams.get('propertyType');
    }
    
    if (searchParams.has('listingType')) {
      query.listingType = searchParams.get('listingType');
    }
    
    if (searchParams.has('minPrice') || searchParams.has('maxPrice')) {
      query.price = {};
      if (searchParams.has('minPrice')) {
        query.price.$gte = parseFloat(searchParams.get('minPrice') || '0');
      }
      if (searchParams.has('maxPrice')) {
        query.price.$lte = parseFloat(searchParams.get('maxPrice') || '100000000000');
      }
    }
    
    if (searchParams.has('bedrooms')) {
      query.bedrooms = { $gte: parseInt(searchParams.get('bedrooms') || '0') };
    }
    
    if (searchParams.has('bathrooms')) {
      query.bathrooms = { $gte: parseInt(searchParams.get('bathrooms') || '0') };
    }
    
    // Get zoom level to decide what fields to return
    const zoom = parseInt(searchParams.get('zoom') || '10');
    const limit = zoom > 14 ? 500 : (zoom > 10 ? 200 : 100); // Limit results based on zoom level
    
    // Select fields based on zoom level
    // At low zoom levels, return minimal data for map markers
    // At high zoom levels, return more details
    let projection = {};
    
    if (zoom < 12) {
      projection = {
        title: 1,
        price: 1,
        propertyType: 1,
        listingType: 1,
        bedrooms: 1,
        bathrooms: 1,
        'address.location': 1,
        'address.city': 1,
        'address.state': 1,
        images: { $slice: 1 }, // Only get the first image
      };
    } else {
      projection = {
        title: 1,
        description: 1,
        price: 1,
        propertyType: 1,
        listingType: 1,
        bedrooms: 1,
        bathrooms: 1,
        area: 1,
        'address.location': 1,
        'address.street': 1,
        'address.city': 1,
        'address.state': 1,
        images: { $slice: 1 }, // Only get the first image
      };
    }
    
    // Execute query
    const properties = await Property.find(query, projection).limit(limit);
    
    // Count total properties in the area (without limit)
    const total = await Property.countDocuments(query);
    
    return NextResponse.json({
      properties,
      total,
      bounds: { north, south, east, west },
      limitApplied: total > limit,
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while searching properties' },
      { status: 500 }
    );
  }
} 