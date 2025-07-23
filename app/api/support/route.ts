import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuthAndSubscription } from '@/app/lib/subscription-middleware';
import { UserType, PlanType } from '@/app/models/Subscription';
import mongoose from 'mongoose';

// Define an interface for support ticket schema
interface ISupportTicket {
  _id?: string;
  user: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  attachments?: string[];
  responses?: {
    responder: string;
    message: string;
    timestamp: Date;
    isAdmin: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Create support ticket schema
const supportTicketSchema = new mongoose.Schema<ISupportTicket>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  category: { type: String, required: true },
  attachments: [{ type: String }],
  responses: [{
    responder: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the model if it doesn't exist
let SupportTicket: mongoose.Model<ISupportTicket>;

try {
  // Try to get the existing model to avoid model overwrite error
  SupportTicket = mongoose.model<ISupportTicket>('SupportTicket');
} catch (_error) {
  // Model doesn't exist yet, create it

  SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
}

/**
 * GET /api/support - Get all support tickets for the user
 * This endpoint requires a premium subscription with customer care feature
 */
async function getUserSupportTickets(request: NextRequest, userId: string) {
  try {
    await connectDB();
    
    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build query
    
    const query: any = { user: userId };
    
    if (status && ['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      query.status = status;
    }
    
    // Find tickets with pagination
    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count
    const total = await SupportTicket.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      tickets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching support tickets' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/support - Create a new support ticket
 * This endpoint requires a premium subscription with customer care feature
 */
async function createSupportTicket(request: NextRequest, userId: string) {
  try {
    await connectDB();
    
    const {
      subject,
      description,
      priority = 'medium',
      category,
      attachments = []
    } = await request.json();
    
    // Validate required fields
    if (!subject || !description || !category) {
      return NextResponse.json(
        { error: 'Subject, description, and category are required' },
        { status: 400 }
      );
    }
    
    // Validate priority
    if (priority && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be one of: low, medium, high, urgent' },
        { status: 400 }
      );
    }
    
    // Get user details
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create support ticket
    const ticket = new SupportTicket({
      user: userId,
      subject,
      description,
      priority,
      category,
      attachments,
      status: 'open',
      responses: [{
        responder: user.name,
        message: description,
        timestamp: new Date(),
        isAdmin: false
      }]
    });
    
    await ticket.save();
    
    return NextResponse.json({
      success: true,
      message: 'Support ticket created successfully',
      ticket
    }, { status: 201 });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while creating support ticket' },
      { status: 500 }
    );
  }
}

// Export the route handlers with authentication and subscription check
// Requires a premium subscription with customer care feature
export const GET = withAuthAndSubscription(
  getUserSupportTickets,
  'customer_care',
  [UserType.OWNER, UserType.DEALER, UserType.BUYER],
  PlanType.PREMIUM // Requiring PREMIUM plan which has customer care
);

export const POST = withAuthAndSubscription(
  createSupportTicket,
  'customer_care',
  [UserType.OWNER, UserType.DEALER, UserType.BUYER],
  PlanType.PREMIUM
); 