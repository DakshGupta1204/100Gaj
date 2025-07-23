import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import connectDB from '@/app/lib/mongodb';
import Payment from '@/app/models/Payment';
// Razorpay configuration
// These should be in environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_key_secret';
// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});
/**
 * Creates a Razorpay order for equity share purchase
 */
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { amount, userId, propertyId, shareCount, propertyTitle } = body;
        if (!amount || !userId || !propertyId || !shareCount) {
            return NextResponse.json({ error: 'Missing required payment parameters' }, { status: 400 });
        }
        // Create a unique receipt ID
        const receipt = `equity_${propertyId}_${Date.now()}`;
        // Create Razorpay order
        const orderOptions = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'INR',
            receipt: receipt,
            notes: {
                userId,
                propertyId,
                shareCount: shareCount.toString(),
                propertyTitle: propertyTitle || 'Equity Share Purchase',
                paymentType: 'equity_purchase'
            }
        };
        const order = await razorpay.orders.create(orderOptions);
        if (!order.id) {
            throw new Error('Failed to create Razorpay order');
        }
        // Save transaction to database
        await Payment.create({
            transactionId: order.id,
            userId,
            amount,
            planType: 'equity_shares',
            planDuration: 'one_time',
            status: 'initiated',
            paymentMethod: 'razorpay',
            responseData: {
                orderId: order.id,
                propertyId,
                shareCount,
                propertyTitle
            }
        });
        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: RAZORPAY_KEY_ID,
            receipt: order.receipt,
            notes: order.notes
        });
    }
    catch (error) {
        // Log error for debugging
        return NextResponse.json({ error: 'Failed to create payment order', details: error.message }, { status: 500 });
    }
}
/**
 * Verifies payment signature and updates payment status
 */
export async function PUT(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: 'Missing required signature verification parameters' }, { status: 400 });
        }
        // Verify signature
        const generated_signature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        const isValidSignature = generated_signature === razorpay_signature;
        if (!isValidSignature) {
            // Update payment status to failed
            await Payment.findOneAndUpdate({ transactionId: razorpay_order_id }, {
                status: 'failed',
                responseData: {
                    error: 'Invalid signature',
                    razorpay_payment_id,
                    razorpay_signature
                }
            });
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }
        // Fetch payment details from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        // Update payment status in database
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: razorpay_order_id }, {
            status: payment.status === 'captured' ? 'success' : 'failed',
            responseData: Object.assign(Object.assign({}, payment), { razorpay_payment_id,
                razorpay_signature, verified: true })
        }, { new: true });
        if (!updatedPayment) {
            return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            status: payment.status,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: Number(payment.amount) / 100, // Convert back to rupees
            payment: updatedPayment
        });
    }
    catch (error) {
        // Log error for debugging
        return NextResponse.json({ error: 'Payment verification failed', details: error.message }, { status: 500 });
    }
}
/**
 * Get payment status by order ID
 */
export async function GET(req) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const orderId = url.searchParams.get('orderId');
        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }
        const payment = await Payment.findOne({ transactionId: orderId });
        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            payment: {
                transactionId: payment.transactionId,
                status: payment.status,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                createdAt: payment.createdAt,
                responseData: payment.responseData
            }
        });
    }
    catch (error) {
        // Log error for debugging
        return NextResponse.json({ error: 'Failed to get payment status', details: error.message }, { status: 500 });
    }
}
