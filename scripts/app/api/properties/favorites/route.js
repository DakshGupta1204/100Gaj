import { NextResponse } from 'next/server';
import Property from '@/app/models/Property';
import Favorite from '@/app/models/Favorite';
import { connectToDB } from '@/app/lib/mongoose';
export async function GET(request) {
    try {
        await connectToDB();
        // Get user ID from session or token
        // In a real implementation, you would validate the user session and get the user ID
        // For example: const userId = await getUserIdFromSession(request);
        const userId = request.nextUrl.searchParams.get('userId') || 'dummy-user-id';
        // Find all favorites for this user and populate the property data
        const favorites = await Favorite.find({ user: userId }).populate({
            path: 'property',
            model: Property,
        });
        // Extract the property data from each favorite
        const properties = favorites.map(favorite => favorite.property);
        return NextResponse.json({
            success: true,
            properties
        }, { status: 200 });
    }
    catch (_error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch favorite properties'
        }, { status: 500 });
    }
}
