import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Subscription from '@/app/models/Subscription';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';

// Helper to check if user is admin
const isAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  return user && user.role === 'admin';
};

// GET /api/admin/subscriptions - Get all subscriptions (admin only)
export const GET = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    // Get query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status'); // active, expired, all
    const userType = url.searchParams.get('userType');
    const planType = url.searchParams.get('planType');
    const userId = url.searchParams.get('userId');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    
    // Build query
   
    const query: any = {};
    
    if (status === 'active') {
      query.isActive = true;
      query.endDate = { $gte: new Date() };
    } else if (status === 'expired') {
      query.$or = [
        { isActive: false },
        { endDate: { $lt: new Date() } }
      ];
    }
    
    if (userType) {
      query.userType = userType;
    }
    
    if (planType) {
      query.planType = planType;
    }
    
    if (userId) {
      query.user = userId;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await Subscription.countDocuments(query);
    
    // Get subscriptions with pagination and sorting
    const subscriptions = await Subscription.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone');
    
    // Check for any expired but still active subscriptions
    const now = new Date();
    for (const sub of subscriptions) {
      if (sub.isActive && sub.endDate < now) {
        sub.isActive = false;
        await sub.save();
      }
    }
    
    return NextResponse.json({
      success: true,
      subscriptions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching subscriptions' },
      { status: 500 }
    );
  }
});

// PATCH /api/admin/subscriptions - Bulk update subscriptions (e.g., extend, disable)
export const PATCH = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    // Verify admin status
    if (!(await isAdmin(userId))) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required' },
        { status: 403 }
      );
    }
    
    const { 
      subscriptionIds, 
      action, 
      extensionDays,
      reason
    } = await request.json();
    
    // Validate input
    if (!subscriptionIds || !Array.isArray(subscriptionIds) || subscriptionIds.length === 0) {
      return NextResponse.json(
        { error: 'No subscription IDs provided' },
        { status: 400 }
      );
    }
    
    if (!action || !['extend', 'disable', 'enable', 'reset_usage'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be one of: extend, disable, enable, reset_usage' },
        { status: 400 }
      );
    }
    
    if (action === 'extend' && (!extensionDays || extensionDays <= 0)) {
      return NextResponse.json(
        { error: 'Extension days must be a positive number' },
        { status: 400 }
      );
    }
    
    // Process update based on action
    let updateCount = 0;
    const now = new Date();
    
    for (const id of subscriptionIds) {
      const subscription = await Subscription.findById(id);
      
      if (!subscription) continue;
      
      switch (action) {
        case 'extend':
          // Extend subscription end date
          const newEndDate = new Date(subscription.endDate);
          newEndDate.setDate(newEndDate.getDate() + extensionDays);
          subscription.endDate = newEndDate;
          
          // If subscription was inactive but end date is now in the future, reactivate it
          if (!subscription.isActive && newEndDate > now) {
            subscription.isActive = true;
          }
          
          // Add note to payment history
          subscription.paymentHistory.push({
            transactionId: 'ADMIN-EXT-' + Date.now(),
            amount: 0,
            date: now,
            status: 'completed',
            note: `Admin extended subscription by ${extensionDays} days. Reason: ${reason || 'Not specified'}`
          });
          break;
          
        case 'disable':
          subscription.isActive = false;
          
          // Add note to payment history
          subscription.paymentHistory.push({
            transactionId: 'ADMIN-DISABLE-' + Date.now(),
            amount: 0,
            date: now,
            status: 'cancelled',
            note: `Admin disabled subscription. Reason: ${reason || 'Not specified'}`
          });
          break;
          
        case 'enable':
          // Only enable if end date is in the future
          if (subscription.endDate > now) {
            subscription.isActive = true;
            
            // Add note to payment history
            subscription.paymentHistory.push({
              transactionId: 'ADMIN-ENABLE-' + Date.now(),
              amount: 0,
              date: now,
              status: 'completed',
              note: `Admin enabled subscription. Reason: ${reason || 'Not specified'}`
            });
          }
          break;
          
        case 'reset_usage':
          // Reset listings and contacts usage
          subscription.listings.used = 0;
          subscription.contacts.used = 0;
          
          // Add note to payment history
          subscription.paymentHistory.push({
            transactionId: 'ADMIN-RESET-' + Date.now(),
            amount: 0,
            date: now,
            status: 'completed',
            note: `Admin reset usage counters. Reason: ${reason || 'Not specified'}`
          });
          break;
      }
      
      await subscription.save();
      updateCount++;
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${updateCount} subscription(s)`,
      updatedCount: updateCount
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while updating subscriptions' },
      { status: 500 }
    );
  }
}); 