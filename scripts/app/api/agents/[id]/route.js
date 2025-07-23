import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Property from '@/app/models/Property';
import mongoose from 'mongoose';
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// GET /api/agents/[id] - Get agent details and their properties
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid agent ID format' }, { status: 400 });
        }
        await connectDB();
        // Get agent details
        const agent = await User.findOne({
            _id: id,
            isAgent: true,
            'agentInfo.verified': true,
        }).select('name email phone image bio address isAgent agentInfo social lastActive');
        if (!agent) {
            return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }
        // Parse query parameters for properties
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        // Get agent's properties
        const propertiesQuery = {
            $or: [
                { owner: id },
                { agent: id },
            ],
            status: 'active',
        };
        const [properties, totalProperties] = await Promise.all([
            Property.find(propertiesQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('title price propertyType listingType bedrooms bathrooms area images address status createdAt'),
            Property.countDocuments(propertiesQuery),
        ]);
        // Get agent's stats
        const stats = {
            activeListings: await Property.countDocuments({
                $or: [{ owner: id }, { agent: id }],
                status: 'active',
            }),
            soldProperties: await Property.countDocuments({
                $or: [{ owner: id }, { agent: id }],
                status: 'sold',
            }),
            rentedProperties: await Property.countDocuments({
                $or: [{ owner: id }, { agent: id }],
                status: 'rented',
            }),
        };
        return NextResponse.json({
            agent,
            stats,
            properties,
            pagination: {
                total: totalProperties,
                page,
                limit,
                pages: Math.ceil(totalProperties / limit),
            },
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching agent details' }, { status: 500 });
    }
}
;
