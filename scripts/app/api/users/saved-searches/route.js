import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import SavedSearch from '@/app/models/SavedSearch';
import { withAuth } from '@/app/lib/auth-middleware';
// GET /api/users/saved-searches - Get all saved searches for the current user
export const GET = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Parse query parameters for pagination
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;
        // Get saved searches
        const savedSearches = await SavedSearch.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Total count for pagination
        const total = await SavedSearch.countDocuments({ user: userId });
        return NextResponse.json({
            savedSearches,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching saved searches' }, { status: 500 });
    }
});
// POST /api/users/saved-searches - Create a new saved search
export const POST = withAuth(async (request, userId) => {
    try {
        const data = await request.json();
        // Validate required fields
        if (!data.name || !data.filters) {
            return NextResponse.json({ error: 'Name and filters are required' }, { status: 400 });
        }
        await connectDB();
        // Check for maximum saved searches (optional limit)
        const savedSearchCount = await SavedSearch.countDocuments({ user: userId });
        const MAX_SAVED_SEARCHES = 10; // Configurable limit
        if (savedSearchCount >= MAX_SAVED_SEARCHES) {
            return NextResponse.json({ error: `You can only save up to ${MAX_SAVED_SEARCHES} searches` }, { status: 400 });
        }
        // Create new saved search
        const savedSearch = new SavedSearch({
            user: userId,
            name: data.name,
            filters: data.filters,
            alertFrequency: data.alertFrequency || 'none',
        });
        await savedSearch.save();
        return NextResponse.json({
            success: true,
            message: 'Search saved successfully',
            savedSearch,
        }, { status: 201 });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while saving the search' }, { status: 500 });
    }
});
