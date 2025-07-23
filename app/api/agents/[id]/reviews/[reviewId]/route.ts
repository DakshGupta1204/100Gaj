import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Review from '@/app/models/Review';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';

// Helper function to validate ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Helper function to update agent rating
async function updateAgentRating(agentId: string) {
  const [totalRating, reviewCount] = await Promise.all([
    Review.aggregate([
      {
        $match: {
          agent: new mongoose.Types.ObjectId(agentId),
          status: 'approved',
        },
      },
      {
        $group: {
          _id: null,
          totalRating: { $sum: '$rating' },
        },
      },
    ]),
    Review.countDocuments({
      agent: agentId,
      status: 'approved',
    }),
  ]);

  const averageRating = reviewCount > 0 ? totalRating[0]?.totalRating / reviewCount : 0;

  await User.findByIdAndUpdate(agentId, {
    $set: {
      'agentInfo.rating': averageRating,
      'agentInfo.reviewCount': reviewCount,
    },
  });
}

// PUT /api/agents/[id]/reviews/[reviewId] - Update a review
export const PUT = withAuth(async (
  request: NextRequest,
  userId: string
) => {
  try {
    // Extract agent ID and review ID from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const agentId = pathSegments[pathSegments.length - 3]; // "agents" at 0, "id" at 1, actual ID at 2
    const reviewId = pathSegments[pathSegments.length - 1]; // Last segment is the review ID
    
    const { rating, title, comment } = await request.json();
    
    if (!isValidObjectId(agentId) || !isValidObjectId(reviewId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Rating, title, and comment are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the review
    const review = await Review.findOne({
      _id: reviewId,
      agent: agentId,
      reviewer: userId,
    });
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Update review
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.status = 'pending'; // Reset to pending for re-approval
    
    await review.save();
    
    // For now, auto-approve the update
    review.status = 'approved';
    await review.save();
    await updateAgentRating(agentId);
    
    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
   
  } catch (error: any) {

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
      }));
      
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while updating the review' },
      { status: 500 }
    );
  }
});

// DELETE /api/agents/[id]/reviews/[reviewId] - Delete a review
export const DELETE = withAuth(async (
  request: NextRequest,
  userId: string
) => {
  try {
    // Extract agent ID and review ID from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const agentId = pathSegments[pathSegments.length - 3]; // "agents" at 0, "id" at 1, actual ID at 2
    const reviewId = pathSegments[pathSegments.length - 1]; // Last segment is the review ID
    
    if (!isValidObjectId(agentId) || !isValidObjectId(reviewId)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find and delete the review
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      agent: agentId,
      reviewer: userId,
    });
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Update agent rating
    await updateAgentRating(agentId);
    
    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while deleting the review' },
      { status: 500 }
    );
  }
}); 