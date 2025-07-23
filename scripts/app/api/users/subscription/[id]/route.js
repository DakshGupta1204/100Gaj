import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Subscription, { PlanType } from '@/app/models/Subscription';
import mongoose from 'mongoose';
import { withAuth } from '@/app/lib/auth-middleware';
// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// GET /api/users/subscription/[id] - Get subscription by ID
export const GET = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Extract subscription ID from URL
        const subscriptionId = request.url.split('/').pop();
        if (!subscriptionId || !isValidObjectId(subscriptionId)) {
            return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
        }
        // Find subscription
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }
        // Check if user is authorized to view this subscription
        if (subscription.user.toString() !== userId) {
            return NextResponse.json({ error: 'Unauthorized to access this subscription' }, { status: 403 });
        }
        return NextResponse.json({
            success: true,
            subscription
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching subscription' }, { status: 500 });
    }
});
// PATCH /api/users/subscription/[id] - Update subscription (change plan, toggle auto-renew)
export const PATCH = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Extract subscription ID from URL
        const subscriptionId = request.url.split('/').pop();
        if (!subscriptionId || !isValidObjectId(subscriptionId)) {
            return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
        }
        // Get request body
        const { autoRenew, planChangeTo, transactionId, price } = await request.json();
        // Find subscription
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }
        // Check if user is authorized to update this subscription
        if (subscription.user.toString() !== userId) {
            return NextResponse.json({ error: 'Unauthorized to update this subscription' }, { status: 403 });
        }
        // Check if subscription is active
        if (!subscription.isActive) {
            return NextResponse.json({ error: 'Cannot update an inactive subscription' }, { status: 400 });
        }
        let updated = false;
        // Update auto-renew setting if provided
        if (typeof autoRenew === 'boolean') {
            subscription.autoRenew = autoRenew;
            updated = true;
        }
        // Handle plan change if requested
        if (planChangeTo && Object.values(PlanType).includes(planChangeTo) && planChangeTo !== subscription.planType) {
            // Validate transaction details if changing to a paid plan
            if (planChangeTo !== PlanType.FREE && (!transactionId || !price)) {
                return NextResponse.json({ error: 'Transaction ID and price are required for changing to a paid plan' }, { status: 400 });
            }
            // Update plan details
            subscription.planType = planChangeTo;
            // Set new price if changing plans
            if (planChangeTo !== PlanType.FREE) {
                subscription.price = Number(price);
                // Add plan change to payment history
                subscription.paymentHistory.push({
                    transactionId,
                    amount: Number(price),
                    date: new Date(),
                    status: 'completed',
                    note: 'Plan change'
                });
            }
            else {
                subscription.price = 0;
            }
            // Update listings and contacts based on new plan
            // The pre-save middleware will handle setting the correct values
            updated = true;
        }
        if (!updated) {
            return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
        }
        // Save the updated subscription
        await subscription.save();
        return NextResponse.json({
            success: true,
            message: 'Subscription updated successfully',
            subscription
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while updating subscription' }, { status: 500 });
    }
});
// DELETE /api/users/subscription/[id] - Cancel subscription
export const DELETE = withAuth(async (request, userId) => {
    try {
        await connectDB();
        // Extract subscription ID from URL
        const subscriptionId = request.url.split('/').pop();
        if (!subscriptionId || !isValidObjectId(subscriptionId)) {
            return NextResponse.json({ error: 'Invalid subscription ID' }, { status: 400 });
        }
        // Find subscription
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }
        // Check if user is authorized to cancel this subscription
        if (subscription.user.toString() !== userId) {
            return NextResponse.json({ error: 'Unauthorized to cancel this subscription' }, { status: 403 });
        }
        // Mark subscription as inactive but don't delete from database
        subscription.isActive = false;
        subscription.autoRenew = false;
        // Add cancellation note to history
        subscription.paymentHistory.push({
            transactionId: 'CANCEL-' + Date.now(),
            amount: 0,
            date: new Date(),
            status: 'cancelled',
            note: 'Subscription cancelled by user'
        });
        await subscription.save();
        return NextResponse.json({
            success: true,
            message: 'Subscription cancelled successfully',
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while cancelling subscription' }, { status: 500 });
    }
});
