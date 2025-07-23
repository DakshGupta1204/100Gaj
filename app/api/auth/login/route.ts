import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { comparePassword, generateToken } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    try {
      const token = generateToken({ 
        userId: user._id.toString(), 
        email: user.email 
      });

      // Return user info without sensitive data
      const userWithoutPassword = {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      };

      return NextResponse.json(
        { 
          success: true, 
          message: 'Login successful',
          user: userWithoutPassword,
          token 
        },
        { status: 200 }
      );
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return NextResponse.json(
        { error: 'Authentication failed. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
} 