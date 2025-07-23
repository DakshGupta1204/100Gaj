import { NextResponse } from 'next/server';
import connectDB from './mongodb';
import Subscription, { UserType, PlanType } from '../models/Subscription';
import { withAuth } from './auth-middleware';
/**
 * Middleware to check if a user has an active subscription with sufficient privileges
 * for a specific action.
 *
 * @param handler The route handler function
 * @param requiredAction The action being performed (e.g., 'create_listing', 'view_contact')
 * @param requiredUserTypes Array of allowed user types for this action
 * @param minPlanType Minimum plan type required for this action
 * @returns NextResponse
 */
export function withSubscription(handler, requiredAction, requiredUserTypes = [UserType.OWNER, UserType.DEALER, UserType.BUYER], minPlanType = PlanType.FREE) {
    return async (request, userId) => {
        try {
            await connectDB();
            // Get user's subscription
            const subscription = await Subscription.findOne({
                user: userId,
                isActive: true,
                endDate: { $gt: new Date() }
            });
            // Check if user has an active subscription
            if (subscription) {
                return NextResponse.json({ error: 'You need an active subscription to perform this action' }, { status: 403 });
            }
            // Check if user type is allowed for this action
            if (!requiredUserTypes.includes(subscription.userType)) {
                return NextResponse.json({ error: `This action is only available to ${requiredUserTypes.join(', ')} accounts` }, { status: 403 });
            }
            // Check if plan is sufficient
            const planLevels = {
                [PlanType.FREE]: 0,
                [PlanType.BASIC]: 1,
                [PlanType.STANDARD]: 2,
                [PlanType.PREMIUM]: 3,
                [PlanType.BOSS]: 4
            };
            if (planLevels[subscription.planType] < planLevels[minPlanType]) {
                return NextResponse.json({ error: `This action requires a ${minPlanType} plan or higher` }, { status: 403 });
            }
            // Check for specific action limits
            if (requiredAction === 'create_listing') {
                // Check if user has listings available
                if (subscription.listings.used >= subscription.listings.total) {
                    return NextResponse.json({ error: 'You have used all your available listings for this subscription period' }, { status: 403 });
                }
            }
            else if (requiredAction === 'view_contact') {
                // Check if user is a buyer and has contact views available
                if (subscription.userType === UserType.BUYER &&
                    subscription.contacts.used >= subscription.contacts.total) {
                    return NextResponse.json({ error: 'You have used all your available contact views for this subscription period' }, { status: 403 });
                }
            }
            else if (requiredAction === 'use_ai') {
                // Check if plan has AI access
                if (!subscription.features.aiTools) {
                    return NextResponse.json({ error: 'AI tools are not available on your current subscription plan' }, { status: 403 });
                }
            }
            else if (requiredAction === 'virtual_tour') {
                // Check if plan has virtual tour access
                if (!subscription.features.virtualTours) {
                    return NextResponse.json({ error: 'Virtual tours are not available on your current subscription plan' }, { status: 403 });
                }
            }
            else if (requiredAction === 'customer_care') {
                // Check if plan has customer care access
                if (!subscription.features.customerCare) {
                    return NextResponse.json({ error: 'Customer care access is not available on your current subscription plan' }, { status: 403 });
                }
            }
            // If all checks pass, call the original handler
            return await handler(request, userId);
        }
        catch (_error) {
            return NextResponse.json({ error: 'An error occurred while checking subscription status' }, { status: 500 });
        }
    };
}
/**
 * Combine withAuth and withSubscription middlewares
 *
 * @param handler The route handler function
 * @param requiredAction The action being performed
 * @param requiredUserTypes Array of allowed user types for this action
 * @param minPlanType Minimum plan type required for this action
 * @returns NextResponse
 */
export function withAuthAndSubscription(handler, requiredAction, requiredUserTypes = [UserType.OWNER, UserType.DEALER, UserType.BUYER], minPlanType = PlanType.FREE) {
    // Create a handler with subscription check
    const handlerWithSubscription = withSubscription(handler, requiredAction, requiredUserTypes, minPlanType);
    // Wrap it with authentication check
    return withAuth(handlerWithSubscription);
}
