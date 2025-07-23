import { NextResponse } from 'next/server';
import dbConnect from '@/app/(microestate)/lib/db';
import Property from '@/app/(microestate)/models/Property';
import { withAuth } from '@/app/lib/auth-middleware';
// GET /api/properties - Get all properties (with pagination and filtering)
export async function GET(request) {
    try {
        await dbConnect();
        // Extract query parameters for filtering
        const searchParams = request.nextUrl.searchParams;
        const propertyType = searchParams.get('propertyType');
        const city = searchParams.get('city');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const limit = parseInt(searchParams.get('limit') || '10');
        // Build query based on filters
        const query = { status: 'active' };
        if (propertyType)
            query.propertyType = propertyType;
        if (city)
            query['address.city'] = { $regex: city, $options: 'i' };
        if (minPrice)
            query.price = Object.assign(Object.assign({}, query.price), { $gte: parseInt(minPrice) });
        if (maxPrice)
            query.price = Object.assign(Object.assign({}, query.price), { $lte: parseInt(maxPrice) });
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
    }
    catch (_error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch properties'
        }, { status: 500 });
    }
}
// POST /api/properties - Create a new property listing
export const POST = withAuth(async (request, userId) => {
    try {
        await dbConnect();
        const data = await request.json();
        // Validate required fields
        const requiredFields = ['title', 'description', 'price', 'propertyType', 'area', 'address', 'images'];
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
        }
        // Handle address required fields
        if (!data.address) {
            return NextResponse.json({ error: 'Address must include street, city, and state' }, { status: 400 });
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
        const propertyData = Object.assign(Object.assign({}, data), { owner: userId, status: data.status || 'active', views: 0, favorites: 0, verified: false, 
            // Set defaults for optional fields that are required by the model
            amenities: data.amenities || [], features: data.features || [], furnished: data.furnished || false, ownerDetails: {
                name: data.ownerDetails.name,
                phone: data.ownerDetails.phone
            } });
        // Create new property
        const property = new Property(propertyData);
        await property.save();
        return NextResponse.json({
            success: true,
            message: 'Property created successfully',
            property,
        }, { status: 201 });
    }
    catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message,
            }));
            return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
        }
        return NextResponse.json({ error: 'An error occurred while creating the property' }, { status: 500 });
    }
});
