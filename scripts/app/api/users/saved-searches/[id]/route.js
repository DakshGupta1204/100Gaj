import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import SavedSearch from '@/app/models/SavedSearch';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// GET /api/users/saved-searches/[id] - Get a specific saved search
export const GET = withAuth(async (request, userId) => {
    try {
        // Extract saved search ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const savedSearchId = pathSegments[pathSegments.length - 1]; // Last segment is the saved search ID
        if (!isValidObjectId(savedSearchId)) {
            return NextResponse.json({ error: 'Invalid saved search ID format' }, { status: 400 });
        }
        await connectDB();
        // Find the saved search
        const savedSearch = await SavedSearch.findById(savedSearchId);
        if (!savedSearch) {
            return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
        }
        // Check ownership
        if (savedSearch.user.toString() !== userId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        return NextResponse.json(savedSearch);
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching the saved search' }, { status: 500 });
    }
});
// PUT /api/users/saved-searches/[id] - Update a saved search
export const PUT = withAuth(async (request, userId) => {
    try {
        // Extract saved search ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const savedSearchId = pathSegments[pathSegments.length - 1]; // Last segment is the saved search ID
        const data = await request.json();
        if (!isValidObjectId(savedSearchId)) {
            return NextResponse.json({ error: 'Invalid saved search ID format' }, { status: 400 });
        }
        // Validate required fields
        if (!data.name || !data.filters) {
            return NextResponse.json({ error: 'Name and filters are required' }, { status: 400 });
        }
        await connectDB();
        // Find the saved search
        const savedSearch = await SavedSearch.findById(savedSearchId);
        if (!savedSearch) {
            return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
        }
        // Check ownership
        if (savedSearch.user.toString() !== userId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        // Update the saved search
        const updatedSavedSearch = await SavedSearch.findByIdAndUpdate(savedSearchId, {
            $set: {
                name: data.name,
                filters: data.filters,
                alertFrequency: data.alertFrequency || savedSearch.alertFrequency,
            },
        }, { new: true, runValidators: true });
        return NextResponse.json({
            success: true,
            message: 'Saved search updated successfully',
            savedSearch: updatedSavedSearch,
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while updating the saved search' }, { status: 500 });
    }
});
// DELETE /api/users/saved-searches/[id] - Delete a saved search
export const DELETE = withAuth(async (request, userId) => {
    try {
        // Extract saved search ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const savedSearchId = pathSegments[pathSegments.length - 1]; // Last segment is the saved search ID
        if (!isValidObjectId(savedSearchId)) {
            return NextResponse.json({ error: 'Invalid saved search ID format' }, { status: 400 });
        }
        await connectDB();
        // Find the saved search
        const savedSearch = await SavedSearch.findById(savedSearchId);
        if (!savedSearch) {
            return NextResponse.json({ error: 'Saved search not found' }, { status: 404 });
        }
        // Check ownership
        if (savedSearch.user.toString() !== userId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        // Delete the saved search
        await SavedSearch.findByIdAndDelete(savedSearchId);
        return NextResponse.json({
            success: true,
            message: 'Saved search deleted successfully',
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while deleting the saved search' }, { status: 500 });
    }
});
