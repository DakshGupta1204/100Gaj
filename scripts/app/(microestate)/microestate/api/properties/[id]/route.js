var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { NextResponse } from 'next/server';
import DBconnect from '@/app/(microestate)/lib/db';
import Property from '@/app/models/Property';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// GET /api/properties/[id] - Get a single property by ID
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
        }
        await DBconnect();
        // Find property by ID and increment views
        const property = await Property.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true } // Return the updated document
        )
            .populate('owner', 'name email')
            .populate('agent', 'name email phone');
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        return NextResponse.json(property, { status: 200 });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching the property' }, { status: 500 });
    }
}
// PUT /api/properties/[id] - Update a property
export const PUT = withAuth(async (request, userId) => {
    try {
        const id = request.url.split('/').pop();
        if (!id || !isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
        }
        const data = await request.json();
        await DBconnect();
        // Find property and check ownership
        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        // Check if user is the owner or agent
        if (property.owner.toString() !== userId && (!property.agent || property.agent.toString() !== userId)) {
            return NextResponse.json({ error: 'You do not have permission to update this property' }, { status: 403 });
        }
        // Remove fields that shouldn't be updated
        const updateData = __rest(data, []);
        // Update the property
        const updatedProperty = await Property.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
        return NextResponse.json({
            success: true,
            message: 'Property updated successfully',
            property: updatedProperty,
        }, { status: 200 });
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
        return NextResponse.json({ error: 'An error occurred while updating the property' }, { status: 500 });
    }
});
// DELETE /api/properties/[id] - Delete a property
export const DELETE = withAuth(async (request, userId) => {
    try {
        const id = request.url.split('/').pop();
        if (!id || !isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
        }
        await DBconnect();
        // Find property and check ownership
        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        // Check if user is the owner
        if (property.owner.toString() !== userId) {
            return NextResponse.json({ error: 'You do not have permission to delete this property' }, { status: 403 });
        }
        // Delete the property
        await Property.findByIdAndDelete(id);
        return NextResponse.json({
            success: true,
            message: 'Property deleted successfully',
        }, { status: 200 });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while deleting the property' }, { status: 500 });
    }
});
