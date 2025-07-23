import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// POST /api/properties/[id]/assign-agent - Assign an agent to a property
export const POST = withAuth(async (request, userId) => {
    try {
        // const id = request.url.split('/').pop()?.split('/')[0];
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const id = pathSegments[pathSegments.length - 2];
        if (!id || !isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid property ID format" }, { status: 400 });
        }
        const { agentId } = await request.json();
        if (!agentId || !isValidObjectId(agentId)) {
            return NextResponse.json({ error: 'Valid agent ID is required' }, { status: 400 });
        }
        await connectDB();
        // Find property and check ownership
        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        // Check if user is the owner
        if (property.owner.toString() !== userId) {
            return NextResponse.json({ error: 'You do not have permission to assign an agent to this property' }, { status: 403 });
        }
        // Check if agent exists and is verified
        const agent = await User.findOne({
            _id: agentId,
            isAgent: true,
            'agentInfo.verified': true,
        });
        if (!agent) {
            return NextResponse.json({ error: 'Agent not found or not verified' }, { status: 404 });
        }
        // Assign agent to property
        property.agent = agent._id;
        await property.save();
        // Increment agent's listing count
        await User.findByIdAndUpdate(agentId, {
            $inc: { 'agentInfo.listings': 1 },
        });
        return NextResponse.json({
            success: true,
            message: 'Agent assigned successfully',
            property,
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while assigning the agent' }, { status: 500 });
    }
});
// DELETE /api/properties/[id]/assign-agent - Remove an agent from a property
export const DELETE = withAuth(async (request, userId) => {
    try {
        // const id = request.url.split('/').pop()?.split('/')[0];
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(segment => segment);
        const id = pathSegments[pathSegments.length - 2];
        if (!id || !isValidObjectId(id)) {
            return NextResponse.json({ error: 'Invalid property ID format' }, { status: 400 });
        }
        await connectDB();
        // Find property and check ownership
        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }
        // Check if user is the owner
        if (property.owner.toString() !== userId) {
            return NextResponse.json({ error: 'You do not have permission to remove the agent from this property' }, { status: 403 });
        }
        // Check if an agent is assigned
        if (!property.agent) {
            return NextResponse.json({ error: 'No agent is currently assigned to this property' }, { status: 400 });
        }
        // Store agent ID before removing
        const agentId = property.agent;
        // Remove agent from property
        property.agent = undefined;
        await property.save();
        // Decrement agent's listing count
        await User.findByIdAndUpdate(agentId, {
            $inc: { 'agentInfo.listings': -1 },
        });
        return NextResponse.json({
            success: true,
            message: 'Agent removed successfully',
            property,
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while removing the agent' }, { status: 500 });
    }
});
