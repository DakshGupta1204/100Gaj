import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Subscription, { UserType, PlanType } from '@/app/models/Subscription';
import { withAuth } from '@/app/lib/auth-middleware';

// GET /api/users/subscription - Get current user's subscription
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    // Get the user's current subscription
    const subscription = await Subscription.findOne({ user: userId });
    
    if (!subscription) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'User has no active subscription',
          subscription: null 
        },
        { status: 200 }
      );
    }
    
    // Check if subscription has expired
    if (subscription.endDate < new Date() && subscription.isActive) {
      subscription.isActive = false;
      await subscription.save();
    }
    
    // Check if listings need to be refreshed (for free plans)
    if (subscription.planType === PlanType.FREE && 
        subscription.listings.refreshDate && 
        subscription.listings.refreshDate < new Date() && 
        subscription.listings.used >= subscription.listings.total) {
      
      // Reset used listings and set new refresh date
      subscription.listings.used = 0;
      const refreshDate = new Date();
      refreshDate.setMonth(refreshDate.getMonth() + 3); // Next refresh in 3 months
      subscription.listings.refreshDate = refreshDate;
      await subscription.save();
    }
    
    // Check if contacts need to be refreshed (for free buyer plans)
    if (subscription.userType === UserType.BUYER && 
        subscription.planType === PlanType.FREE && 
        subscription.contacts.refreshDate && 
        subscription.contacts.refreshDate < new Date() && 
        subscription.contacts.used >= subscription.contacts.total) {
      
      // Reset used contacts and set new refresh date
      subscription.contacts.used = 0;
      const refreshDate = new Date();
      refreshDate.setMonth(refreshDate.getMonth() + 9); // Next refresh in 9 months
      subscription.contacts.refreshDate = refreshDate;
      await subscription.save();
    }
    
    return NextResponse.json({
      success: true,
      subscription
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching subscription details' },
      { status: 500 }
    );
  }
});

// POST /api/users/subscription - Create or update user subscription
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const { 
      userType, 
      planType, 
      price,
      transactionId,
      autoRenew = false
    } = await request.json();
    
    // Input validation
    if (!userType || !planType || !transactionId) {
      return NextResponse.json(
        { error: 'User type, plan type, and transaction ID are required' },
        { status: 400 }
      );
    }
    
    // Check if user type is valid
    if (!Object.values(UserType).includes(userType as UserType)) {
      return NextResponse.json(
        { error: 'Invalid user type. Must be owner, dealer, or buyer' },
        { status: 400 }
      );
    }
    
    // Check if plan type is valid
    if (!Object.values(PlanType).includes(planType as PlanType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be free, basic, standard, premium, or boss' },
        { status: 400 }
      );
    }
    
    // Validate price based on plan and user type
    let validPrice = true;
    const planPrice = Number(price) || 0;
    
    if (planType === PlanType.FREE && planPrice !== 0) {
      validPrice = false;
    } else if (userType === UserType.OWNER) {
      if (planType === PlanType.BASIC && planPrice !== 500) validPrice = false;
      else if (planType === PlanType.STANDARD && planPrice !== 1000) validPrice = false;
      else if (planType === PlanType.PREMIUM && planPrice !== 2000) validPrice = false;
    } else if (userType === UserType.DEALER) {
      if (planType === PlanType.BASIC && planPrice !== 1000) validPrice = false;
      else if (planType === PlanType.STANDARD && planPrice !== 2000) validPrice = false;
      else if (planType === PlanType.PREMIUM && planPrice !== 5000) validPrice = false;
    } else if (userType === UserType.BUYER && planType === PlanType.BOSS) {
      if (![1000, 2000, 10000].includes(planPrice)) validPrice = false;
    }
    
    if (!validPrice) {
      return NextResponse.json(
        { error: 'Invalid price for the selected plan and user type' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if user already has a subscription
    let subscription = await Subscription.findOne({ user: userId });
    const isNewSubscription = !subscription;
    
    // Calculate subscription end date (1 month from now)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    if (isNewSubscription) {
      // Create new subscription
      subscription = new Subscription({
        user: userId,
        userType,
        planType,
        price: planPrice,
        startDate: new Date(),
        endDate,
        isActive: true,
        autoRenew,
        paymentHistory: [{
          transactionId,
          amount: planPrice,
          date: new Date(),
          status: 'completed'
        }]
      });
    } else {
      // Update existing subscription
      subscription.userType = userType;
      subscription.planType = planType as PlanType;
      subscription.price = planPrice;
      subscription.startDate = new Date();
      subscription.endDate = endDate;
      subscription.isActive = true;
      subscription.autoRenew = autoRenew;
      
      // Add new payment to history
      subscription.paymentHistory.push({
        transactionId,
        amount: planPrice,
        date: new Date(),
        status: 'completed'
      });
      
      // Reset used listings for a new subscription period
      if (subscription.planType !== PlanType.FREE) {
        subscription.listings.used = 0;
      }
      
      // Reset used contacts for BOSS plan buyers
      if (userType === UserType.BUYER && planType === PlanType.BOSS) {
        subscription.contacts.used = 0;
      }
    }
    
    await subscription.save();
    
    return NextResponse.json({
      success: true,
      message: isNewSubscription ? 'Subscription created successfully' : 'Subscription updated successfully',
      subscription
    }, { status: isNewSubscription ? 201 : 200 });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while processing subscription' },
      { status: 500 }
    );
  }
}); 