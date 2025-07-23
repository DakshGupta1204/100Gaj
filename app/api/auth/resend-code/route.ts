import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { 
  generateVerificationCode, 
  sendEmail, 
  getVerificationEmailTemplate 
} from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    // Input validation
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hours expiry

    // Update user
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email
    const emailTemplate = getVerificationEmailTemplate(verificationCode);
    const emailSent = await sendEmail(
      user.email,
      'Verify your email address',
      emailTemplate
    );

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Verification code sent successfully' 
      },
      { status: 200 }
    );
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while resending verification code' },
      { status: 500 }
    );
  }
} 