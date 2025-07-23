import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';
import mongoose from 'mongoose';
import { withAuthAndSubscription } from '@/app/lib/subscription-middleware';
import { UserType, PlanType } from '@/app/models/Subscription';
// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
/**
 * POST /api/properties/[id]/virtual-tour - Add or update virtual tour for a property
 * This endpoint requires a subscription with virtual tour access
 */
async function manageVirtualTour(request, userId) {
    var _a, _b, _c, _d, _e;
    try {
        await connectDB();
        // Extract property ID from URL
        const propertyId = request.url.split('/').slice(-2)[0];
        // Validate property ID
        if (!propertyId || !isValidObjectId(propertyId)) {
            return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
        }
        // Find property
        const property = await Property.findById(propertyId);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        // Check if user is authorized to manage this property
        if (property.owner.toString() !== userId &&
            (!property.agent || property.agent.toString() !== userId)) {
            return NextResponse.json({ error: 'You are not authorized to manage this property' }, { status: 403 });
        }
        // Get request body
        const { tourType, panoramaImages, tourUrl, floorPlanUrl, embedCode, additionalDetails } = await request.json();
        // Validate tour type
        if (!tourType || !['360-panorama', '3d-walkthrough', 'video-tour', 'floor-plan'].includes(tourType)) {
            return NextResponse.json({ error: 'Invalid tour type. Must be one of: 360-panorama, 3d-walkthrough, video-tour, floor-plan' }, { status: 400 });
        }
        // Validate required fields based on tour type
        if ((tourType === '360-panorama' && !panoramaImages) ||
            ((tourType === '3d-walkthrough' || tourType === 'video-tour') && !tourUrl && !embedCode) ||
            (tourType === 'floor-plan' && !floorPlanUrl)) {
            return NextResponse.json({ error: 'Missing required fields for the selected tour type' }, { status: 400 });
        }
        // Create or update virtual tour
        property.virtualTour = {
            tourType,
            panoramaImages: tourType === '360-panorama' ? panoramaImages : (_a = property.virtualTour) === null || _a === void 0 ? void 0 : _a.panoramaImages,
            tourUrl: tourUrl || ((_b = property.virtualTour) === null || _b === void 0 ? void 0 : _b.tourUrl),
            floorPlanUrl: floorPlanUrl || ((_c = property.virtualTour) === null || _c === void 0 ? void 0 : _c.floorPlanUrl),
            embedCode: embedCode || ((_d = property.virtualTour) === null || _d === void 0 ? void 0 : _d.embedCode),
            additionalDetails: additionalDetails || ((_e = property.virtualTour) === null || _e === void 0 ? void 0 : _e.additionalDetails),
            updatedAt: new Date()
        };
        await property.save();
        return NextResponse.json({
            success: true,
            message: 'Virtual tour updated successfully',
            virtualTour: property.virtualTour
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while managing virtual tour' }, { status: 500 });
    }
}
/**
 * GET /api/properties/[id]/virtual-tour - Get virtual tour for a property
 */
export async function GET(request) {
    try {
        await connectDB();
        // Extract property ID from URL
        const propertyId = request.url.split('/').slice(-2)[0];
        // Validate property ID
        if (!propertyId || !isValidObjectId(propertyId)) {
            return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
        }
        // Find property with virtual tour
        const property = await Property.findById(propertyId).select('virtualTour title address');
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        if (!property.virtualTour) {
            return NextResponse.json({ error: 'No virtual tour available for this property' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            property: {
                id: property._id,
                title: property.title,
                address: property.address
            },
            virtualTour: property.virtualTour
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching virtual tour' }, { status: 500 });
    }
}
/**
 * DELETE /api/properties/[id]/virtual-tour - Remove virtual tour from a property
 */
async function removeVirtualTour(request, userId) {
    try {
        await connectDB();
        // Extract property ID from URL
        const propertyId = request.url.split('/').slice(-2)[0];
        // Validate property ID
        if (!propertyId || !isValidObjectId(propertyId)) {
            return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
        }
        // Find property
        const property = await Property.findById(propertyId);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        // Check if user is authorized to manage this property
        if (property.owner.toString() !== userId &&
            (!property.agent || property.agent.toString() !== userId)) {
            return NextResponse.json({ error: 'You are not authorized to manage this property' }, { status: 403 });
        }
        // Remove virtual tour
        property.virtualTour = undefined;
        await property.save();
        return NextResponse.json({
            success: true,
            message: 'Virtual tour removed successfully'
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while removing virtual tour' }, { status: 500 });
    }
}
// Export the route handlers with proper middleware
export const POST = withAuthAndSubscription(manageVirtualTour, 'virtual_tour', [UserType.OWNER, UserType.DEALER], PlanType.BASIC // Requiring at least BASIC plan which has virtual tours
);
export const DELETE = withAuthAndSubscription(removeVirtualTour, 'virtual_tour', [UserType.OWNER, UserType.DEALER], PlanType.BASIC);
