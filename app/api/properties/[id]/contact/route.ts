import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';
import Subscription from '@/app/models/Subscription';
import mongoose from 'mongoose';
import { withAuthAndSubscription } from '@/app/lib/subscription-middleware';
import { UserType, PlanType } from '@/app/models/Subscription';

// Validate MongoDB ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/properties/[id]/contact - Get contact information of a property owner/agent
 * This endpoint is protected by subscription check to limit contact views for buyers
 */
async function getContactInfo(request: NextRequest, userId: string) {
  try {
    await connectDB();
    
    // Extract property ID from URL
    const propertyId = request.url.split('/').slice(-2)[0];
    
    // Validate property ID
    if (!propertyId || !isValidObjectId(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }
    
    // Find property with owner and agent information
    const property = await Property.findById(propertyId)
      .populate('owner', 'name email phone address')
      .populate('agent', 'name email phone profileImage bio workingHours');
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Check if current user is the owner or agent of this property
    const isPropertyOwner = property.owner && property.owner._id.toString() === userId;
    const isPropertyAgent = property.agent && property.agent._id.toString() === userId;
    
    // Structure contact information based on user's role
    let contactInfo = {};
    
    if (isPropertyOwner || isPropertyAgent) {
      // If user is the owner or agent, they get complete access
      contactInfo = {
        owner: property.owner,
        agent: property.agent,
        isOwner: isPropertyOwner,
        isAgent: isPropertyAgent
      };
    } else {
      // For other users, provide structured contact info
      contactInfo = {
        owner: property.owner ? {
          name: property.owner.name,
          // Only include full contact details for paid plans or if owner allows
          email: property.owner.email,
          phone: property.owner.phone
        } : null,
        agent: property.agent ? {
          name: property.agent.name,
          email: property.agent.email,
          phone: property.agent.phone,
          profileImage: property.agent.profileImage,
          bio: property.agent.bio,
          workingHours: property.agent.workingHours
        } : null
      };
    }
    
    // Increment contact view count in subscription
    const subscription = await Subscription.findOne({
      user: userId,
      isActive: true
    });
    
    if (subscription && subscription.userType === UserType.BUYER) {
      subscription.contacts.used += 1;
      await subscription.save();
    }
    
    return NextResponse.json({
      success: true,
      contactInfo
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching contact information' },
      { status: 500 }
    );
  }
}

// Export the route handler with authentication and subscription check
export const GET = withAuthAndSubscription(
  getContactInfo,
  'view_contact',
  [UserType.BUYER, UserType.OWNER, UserType.DEALER],
  PlanType.FREE
); 