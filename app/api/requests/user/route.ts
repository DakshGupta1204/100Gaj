import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import VerificationRequest from '@/app/models/VerificationRequest';
import User from '@/app/models/User';
import { verifyToken } from '@/app/lib/utils';

// GET /api/requests/user - Get currently logged in user's verification requests
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get session to check if user is logged in
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedUser = verifyToken(token);
    // Get user
    const user = await User.findOne({ email: decodedUser.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's verification requests
    const requests = await VerificationRequest.find({ userId: user._id })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ requests }, { status: 200 });
  } catch (_error) {

    return NextResponse.json(
      { error: 'Failed to fetch verification requests' },
      { status: 500 }
    );
  }
} 