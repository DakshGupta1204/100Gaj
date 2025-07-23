import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Subscription, { UserType } from '@/app/models/Subscription';
import { withAuth } from '@/app/lib/auth-middleware';
// PATCH /api/users/subscription/usage - Update usage counts for listings or contacts
export const PATCH = withAuth(async (request, userId) => {
    try {
        await connectDB();
        const { action, amount = 1 } = await request.json();
        // Validate action
        if (!action || !['use_listing', 'use_contact'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action. Must be "use_listing" or "use_contact"' }, { status: 400 });
        }
        // Get the user's current subscription
        const subscription = await Subscription.findOne({ user: userId });
        if (!subscription) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
        }
        // Check if subscription is active
        if (!subscription.isActive || subscription.endDate < new Date()) {
            return NextResponse.json({ error: 'Subscription has expired' }, { status: 403 });
        }
        let message = '';
        let success = false;
        if (action === 'use_listing') {
            // Check if user has available listings
            if (subscription.listings.used >= subscription.listings.total) {
                return NextResponse.json({ error: 'You have used all your available listings for this subscription period' }, { status: 403 });
            }
            // Increment used listings count
            subscription.listings.used += Math.max(1, Math.min(amount, subscription.listings.total - subscription.listings.used));
            success = true;
            message = 'Listing usage updated successfully';
        }
        else if (action === 'use_contact') {
            // Validate that user is a buyer
            if (subscription.userType !== UserType.BUYER) {
                return NextResponse.json({ error: 'Only buyers can use contact views' }, { status: 403 });
            }
            // Check if user has available contacts
            if (subscription.contacts.used >= subscription.contacts.total) {
                return NextResponse.json({ error: 'You have used all your available contact views for this subscription period' }, { status: 403 });
            }
            // Increment used contacts count
            subscription.contacts.used += Math.max(1, Math.min(amount, subscription.contacts.total - subscription.contacts.used));
            success = true;
            message = 'Contact usage updated successfully';
        }
        await subscription.save();
        return NextResponse.json({
            success,
            message,
            subscription: {
                listings: subscription.listings,
                contacts: subscription.contacts,
                remaining: {
                    listings: Math.max(0, subscription.listings.total - subscription.listings.used),
                    contacts: Math.max(0, subscription.contacts.total - subscription.contacts.used)
                }
            }
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while updating subscription usage' }, { status: 500 });
    }
});
