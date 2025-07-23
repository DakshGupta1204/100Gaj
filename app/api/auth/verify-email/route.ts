import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { generateToken } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json();

    // Input validation
    if (!userId || !code) {
      return NextResponse.json(
        { error: 'User ID and verification code are required' },
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

    // Check verification code
    if (user.verificationToken !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (user.verificationTokenExpiry && new Date() > user.verificationTokenExpiry) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // Mark email as verified
    user.emailVerified = new Date();
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken({ 
      userId: user._id, 
      email: user.email 
    });

    // Return user info without password
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email verified successfully',
        user: userWithoutPassword,
        token 
      },
      { status: 200 }
    );
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred during email verification' },
      { status: 500 }
    );
  }
} 