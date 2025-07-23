import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { 
  generateVerificationCode, 
  sendEmail, 
  getPasswordResetEmailTemplate 
} from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Input validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    
    // If user not found, still return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'If your email exists in our system, you will receive a password reset code' 
        },
        { status: 200 }
      );
    }

    // Generate password reset code
    const resetCode = generateVerificationCode();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    // Update user
    user.resetPasswordToken = resetCode;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    const emailTemplate = getPasswordResetEmailTemplate(resetCode);
    await sendEmail(
      email,
      'Reset your password',
      emailTemplate
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'If your email exists in our system, you will receive a password reset code',
        userId: user._id
      },
      { status: 200 }
    );
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 