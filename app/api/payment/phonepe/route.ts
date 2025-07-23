import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/app/lib/mongodb';
import Payment from '@/app/models/Payment';

// PhonePe API configuration
// These would normally be in environment variables
const PHONEPE_HOST = 'https://api-preprod.phonepe.com/apis/pg-sandbox'; // Sandbox URL for development
const MERCHANT_ID = 'PGTESTPAYUAT'; // Replace with your merchant ID in production
const SALT_KEY = '099eb0cd-02cf-4e2a-8aca-3e6c6aff399'; // Replace with your salt key in production
const SALT_INDEX = '1';
const CALLBACK_URL = 'https://yourdomain.com/api/payment/phonepe/callback'; // Update in production

/**
 * Initiates a payment through PhonePe
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { amount, userId, planType, planDuration } = body;

    if (!amount || !userId || !planType || !planDuration) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      );
    }

    // Create a unique transaction ID
    const merchantTransactionId = `T${Date.now()}`;
    
    // Create payment payload
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to lowest denomination (paise)
      redirectUrl: `${req.headers.get('origin')}/subscription/success?transactionId=${merchantTransactionId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: CALLBACK_URL,
      paymentInstrument: {
        type: 'PAY_PAGE'
      },
      merchantOrderId: merchantTransactionId,
    };

    // Convert payload to base64
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Create SHA256 hash
    const string = `${payloadBase64}/pg/v1/pay${SALT_KEY}`;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    
    // Create X-VERIFY header
    const xVerify = `${sha256}###${SALT_INDEX}`;
    
    // Make API call to PhonePe
    const response = await fetch(`${PHONEPE_HOST}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: JSON.stringify({
        request: payloadBase64
      }),
    });

    const responseData = await response.json();
    
    if (!responseData.success) {
      throw new Error(responseData.message || 'Payment initialization failed');
    }

    // Save transaction to database
    await Payment.create({
      transactionId: merchantTransactionId,
      userId,
      amount,
      planType,
      planDuration,
      status: 'initiated',
      paymentMethod: 'phonepe',
      responseData: responseData
    });

    return NextResponse.json({
      success: true,
      redirectUrl: responseData.data.instrumentResponse.redirectInfo.url,
      transactionId: merchantTransactionId
    });
  } catch (error: any) {

    return NextResponse.json(
      { error: 'Failed to initiate payment', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handles callback from PhonePe to verify payment status
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Extract merchantTransactionId from the URL
    const url = new URL(req.url);
    const merchantTransactionId = url.searchParams.get('merchantTransactionId');
    
    if (!merchantTransactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is missing' },
        { status: 400 }
      );
    }

    // Check payment status from PhonePe
    const checkStatusUrl = `${PHONEPE_HOST}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
    
    // Create X-VERIFY for status check
    const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}${SALT_KEY}`;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const xVerify = `${sha256}###${SALT_INDEX}`;
    
    const response = await fetch(checkStatusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': MERCHANT_ID,
      },
    });
    
    const responseData = await response.json();
    
    if (!responseData.success) {
      throw new Error(responseData.message || 'Payment status check failed');
    }

    // Update transaction status in database
    const paymentStatus = responseData.data.state;
    const status = paymentStatus === 'COMPLETED' ? 'success' : 
                   paymentStatus === 'PAYMENT_ERROR' ? 'failed' : 
                   paymentStatus === 'PAYMENT_PENDING' ? 'initiated' : 'expired';
    
    await Payment.findOneAndUpdate(
      { transactionId: merchantTransactionId },
      { 
        status,
        responseData: responseData.data
      },
      { new: true }
    );

    // Return status
    return NextResponse.json({
      success: true,
      status: paymentStatus,
      transactionId: merchantTransactionId
    });
  } catch (error: any) {

    return NextResponse.json(
      { error: 'Failed to process payment callback', details: error.message },
      { status: 500 }
    );
  }
} 