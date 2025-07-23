import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
// GET /api/agents - Get all agents with filters
export async function GET(request) {
    try {
        await connectDB();
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        // Build query
        const query = {
            isAgent: true,
            'agentInfo.verified': true,
        };
        // Apply filters
        if (searchParams.has('agency')) {
            query['agentInfo.agency'] = searchParams.get('agency');
        }
        if (searchParams.has('specialization')) {
            query['agentInfo.specializations'] = searchParams.get('specialization');
        }
        if (searchParams.has('language')) {
            query['agentInfo.languages'] = searchParams.get('language');
        }
        if (searchParams.has('minExperience')) {
            query['agentInfo.experience'] = {
                $gte: parseInt(searchParams.get('minExperience') || '0'),
            };
        }
        if (searchParams.has('minRating')) {
            query['agentInfo.rating'] = {
                $gte: parseFloat(searchParams.get('minRating') || '0'),
            };
        }
        if (searchParams.has('city')) {
            query['address.city'] = searchParams.get('city');
        }
        if (searchParams.has('state')) {
            query['address.state'] = searchParams.get('state');
        }
        // Search by name or agency
        if (searchParams.has('search')) {
            const searchTerm = searchParams.get('search');
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { 'agentInfo.agency': { $regex: searchTerm, $options: 'i' } },
            ];
        }
        // Sort options
        const sortOptions = {};
        const sortBy = searchParams.get('sortBy') || 'agentInfo.rating';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        // Get agents
        const agents = await User.find(query)
            .select('name email phone image bio address isAgent agentInfo social lastActive')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
        // Get total count
        const total = await User.countDocuments(query);
        // Get unique agencies, specializations, and languages for filters
        const [agencies, specializations, languages] = await Promise.all([
            User.distinct('agentInfo.agency', { isAgent: true, 'agentInfo.verified': true }),
            User.distinct('agentInfo.specializations', { isAgent: true, 'agentInfo.verified': true }),
            User.distinct('agentInfo.languages', { isAgent: true, 'agentInfo.verified': true }),
        ]);
        return NextResponse.json({
            agents,
            filters: {
                agencies,
                specializations,
                languages,
            },
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching agents' }, { status: 500 });
    }
}
