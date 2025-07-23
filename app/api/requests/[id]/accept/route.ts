import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import VerificationRequest from '@/app/models/VerificationRequest';
import User from '@/app/models/User';
import mongoose from 'mongoose';
import { verifyToken } from '@/app/lib/utils';
import Builder from '@/app/models/Builder';

// POST /api/requests/:id/accept - Accept a verification request
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== ACCEPT VERIFICATION REQUEST START ===');
    
    await connectDB();
    console.log('Database connected successfully');
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log('Authorization check failed - no valid Bearer token');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const decodedUser = verifyToken(token);
    console.log('Token decoded for user:', decodedUser?.userId);
    
    const { id: requestId } = await context.params;
    console.log('Processing request ID:', requestId);
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      console.log('Invalid ObjectId format:', requestId);
      return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 });
    }
    
    const verificationRequest = await VerificationRequest.findById(requestId);
    console.log('Verification request found:', !!verificationRequest);
    console.log('Request details:', verificationRequest ? {
      id: verificationRequest._id,
      type: verificationRequest.type,
      status: verificationRequest.status,
      userId: verificationRequest.userId
    } : 'Not found');
    
    if (!verificationRequest) {
      return NextResponse.json({ error: 'Verification request not found' }, { status: 404 });
    }
    if (verificationRequest.status !== 'pending') {
      console.log('Request already processed with status:', verificationRequest.status);
      return NextResponse.json({ error: 'This request has already been processed' }, { status: 409 });
    }
    
    const user = await User.findById(verificationRequest.userId);
    console.log('User found:', !!user);
    console.log('User details:', user ? {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    } : 'Not found');
    if (!user) {
      return NextResponse.json({ error: 'User associated with this request not found' }, { status: 404 });
    }
    
    verificationRequest.status = 'approved';
    verificationRequest.reviewedBy = decodedUser.userId;
    await verificationRequest.save();
    
    if (verificationRequest.type === 'agent') {
      user.isAgent = true;
      user.role = 'agent';
      if (verificationRequest.requestDetails) {
        user.agentInfo = {
          ...user.agentInfo,
          verified: true,
          licenseNumber: verificationRequest.requestDetails.licenseNumber,
          agency: verificationRequest.requestDetails.agency,
          experience: verificationRequest.requestDetails.experience,
          specializations: verificationRequest.requestDetails.specializations,
          languages: verificationRequest.requestDetails.languages,
        };
        // Add image to user profile if provided in verification request
        if (verificationRequest.requestDetails.agentImage) {
          user.image = verificationRequest.requestDetails.agentImage;
        }
      } else {
        if (!user.agentInfo) {
          user.agentInfo = { verified: true };
        } else {
          user.agentInfo.verified = true;
        }
      }
      await user.save();
    } else if (verificationRequest.type === 'builder') {
      console.log('Processing builder verification...');
      // Update user profile to mark as builder
      user.isBuilder = true;
      user.role = 'builder';
      console.log('User role updated to builder');
      
      if (verificationRequest.requestDetails) {
        console.log('Creating builder with request details:', verificationRequest.requestDetails);
        const builderData = {
          title: verificationRequest.requestDetails.companyName || user.name,
          image: verificationRequest.requestDetails.builderImage || user.image || 'https://via.placeholder.com/300x200',
          logo: verificationRequest.requestDetails.logo || user.image || 'https://via.placeholder.com/100x100',
          projects: 0,
          description: verificationRequest.requestDetails.additionalInfo || `${user.name} is a verified builder on 100Gaj.`,
          established: verificationRequest.requestDetails.established || 'N/A',
          headquarters: verificationRequest.requestDetails.headquarters || 'N/A',
          specialization: verificationRequest.requestDetails.specialization || 'General Construction',
          rating: 0,
          completed: 0,
          ongoing: 0,
          contact: {
            email: user.email,
            phone: user.phone,
          }
        };
        
        console.log('Builder data prepared:', builderData);
        
        // Create a new builder document
        const newBuilder = new Builder(builderData);
        console.log('Builder instance created, attempting save...');
        await newBuilder.save();
        console.log('Builder saved successfully with ID:', newBuilder._id);
      }
      
      // Save the user changes
      console.log('Saving user changes...');
      await user.save();
      console.log('User saved successfully');
    }
    
    console.log('=== VERIFICATION REQUEST COMPLETED SUCCESSFULLY ===');
    return NextResponse.json(
      { message: 'Verification request approved successfully', request: verificationRequest },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('=== ERROR IN ACCEPT VERIFICATION REQUEST ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    return NextResponse.json(
      { error: 'Failed to accept verification request' },
      { status: 500 }
    );
  }
}
