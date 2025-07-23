import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import AgentSchedule from '@/app/models/AgentSchedule';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';

// Helper function to validate ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Helper function to check if time slots overlap
function doTimeSlotsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && end1 > start2;
}

// GET /api/agents/[id]/schedule - Get agent's schedule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    
    if (!isValidObjectId(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if agent exists and is verified
    const agent = await User.findOne({
      _id: agentId,
      isAgent: true,
      'agentInfo.verified': true,
    });
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found or not verified' },
        { status: 404 }
      );
    }
    
    // Get schedule
    const schedule = await AgentSchedule.findOne({ agent: agentId })
      .populate('appointments.client', 'name email phone')
      .populate('appointments.property', 'title address');
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }
    
    // Parse query parameters for date range
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Filter appointments by date range if provided
    let appointments = schedule.appointments;
    if (startDate && endDate) {
      
      appointments = appointments.filter((apt:any) => {
        const aptDate = new Date(apt.date);
        return aptDate >= new Date(startDate) && aptDate <= new Date(endDate);
      });
    }
    
    return NextResponse.json({
      availability: schedule.availability,
      blockedDates: schedule.blockedDates,
      appointments,
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching agent schedule' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/[id]/schedule - Update agent's schedule
export const PUT = withAuth(async (
  request: NextRequest,
  userId: string
) => {
  try {
    // More robust ID extraction
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const id = pathSegments[pathSegments.length - 2]; // The ID should be the second-to-last segment

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid property ID format" },
        { status: 400 }
      );
    }
    
    // Only the agent can update their schedule
    if (id !== userId) {
      return NextResponse.json(
        { error: 'You can only update your own schedule' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    // Check if agent exists and is verified
    const agent = await User.findOne({
      _id: id,
      isAgent: true,
      'agentInfo.verified': true,
    });
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found or not verified' },
        { status: 404 }
      );
    }
    
    // Validate availability time slots
    const { availability, blockedDates } = await request.json();
    if (availability) {
      // Check for overlapping time slots on the same day
      for (let i = 0; i < availability.length; i++) {
        for (let j = i + 1; j < availability.length; j++) {
          if (
            availability[i].dayOfWeek === availability[j].dayOfWeek &&
            doTimeSlotsOverlap(
              availability[i].startTime,
              availability[i].endTime,
              availability[j].startTime,
              availability[j].endTime
            )
          ) {
            return NextResponse.json(
              { error: 'Time slots cannot overlap on the same day' },
              { status: 400 }
            );
          }
        }
      }
    }
    
    // Get or create schedule
    let schedule = await AgentSchedule.findOne({ agent: id });
    
    if (!schedule) {
      schedule = new AgentSchedule({ agent: id });
    }
    
    // Update schedule
    if (availability) {
      schedule.availability = availability;
    }
    
    if (blockedDates) {
      schedule.blockedDates = blockedDates;
    }
    
    await schedule.save();
    
    return NextResponse.json({
      success: true,
      message: 'Schedule updated successfully',
      schedule,
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
      { error: 'An error occurred while updating agent schedule' },
      { status: 500 }
    );
  }
}); 