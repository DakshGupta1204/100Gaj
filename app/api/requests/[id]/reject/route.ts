import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import VerificationRequest from '@/app/models/VerificationRequest';
import User from '@/app/models/User';
import mongoose from 'mongoose';
import { verifyToken } from '@/app/lib/utils';

// POST /api/requests/:id/reject - Reject a verification request
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Get session to check if user is admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedUser = verifyToken(token);
    
    // Check if user is admin
    const adminUser = await User.findOne({ email: decodedUser.email });
    
    // if (!adminUser || adminUser.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized. Admin access required.' },
    //     { status: 403 }
    //   );
    // }
    
    const {id:requestId} = await context.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json(
        { error: 'Invalid request ID' },
        { status: 400 }
      );
    }
    
    // Get rejection reason if provided
    const { reason } = await req.json();
    
    // Find verification request
    const verificationRequest = await VerificationRequest.findById(requestId);
    
    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      );
    }
    
    // Ensure request is still pending
    if (verificationRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'This request has already been processed' },
        { status: 409 }
      );
    }
    
    // Update request status
    verificationRequest.status = 'rejected';
    verificationRequest.reviewedBy = adminUser._id;
    verificationRequest.rejectionReason = reason || 'Your verification request has been rejected.';
    
    await verificationRequest.save();
    
    return NextResponse.json(
      { 
        message: 'Verification request rejected successfully',
        request: verificationRequest
      },
      { status: 200 }
    );
  } catch (_error) {

    return NextResponse.json(
      { error: 'Failed to reject verification request' },
      { status: 500 }
    );
  }
} 