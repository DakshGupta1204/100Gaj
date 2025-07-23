import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import AgentSchedule from '@/app/models/AgentSchedule';
import User from '@/app/models/User';
import Property from '@/app/models/Property';
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

// Helper function to check if appointment time is within agent's availability
function isTimeSlotAvailable(
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  availability: any[]
): boolean {
  return availability.some(slot => {
    return (
      slot.dayOfWeek === dayOfWeek &&
      slot.startTime <= startTime &&
      slot.endTime >= endTime
    );
  });
}

// GET /api/agents/[id]/appointments - Get agent's appointments
export const GET = withAuth(async (
  request: NextRequest,
  userId: string
) => {
  try {
    // Extract agent ID from URL instead of using params
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const agentId = pathSegments[pathSegments.length - 2]; // "agents" at 0, "id" at 1, "[id]" value at 2
    
    if (!isValidObjectId(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if user is the agent or a client with appointments
    const schedule = await AgentSchedule.findOne({ agent: agentId });
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }
    
    // Filter appointments based on user role
    let appointments = schedule.appointments;
    if (agentId !== userId) {
      // If not the agent, only show own appointments
      appointments = appointments.filter((apt: any) => 
        apt.client.toString() === userId
      );
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Apply filters
    if (status) {
      appointments = appointments.filter((apt: any) => apt.status === status);
    }
    
    if (startDate && endDate) {
      appointments = appointments.filter((apt: any) => {
        const aptDate = new Date(apt.date);
        return aptDate >= new Date(startDate) && aptDate <= new Date(endDate);
      });
    }
    
    // Sort appointments by date and time
  
    appointments.sort((a: any, b: any) => {
      const dateA = new Date(a.date).getTime() + new Date(`1970-01-01T${a.startTime}`).getTime();
      const dateB = new Date(b.date).getTime() + new Date(`1970-01-01T${b.startTime}`).getTime();
      return dateA - dateB;
    });
    
    return NextResponse.json({ appointments });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching appointments' },
      { status: 500 }
    );
  }
});

// POST /api/agents/[id]/appointments - Create a new appointment
export const POST = withAuth(async (
  request: NextRequest,
  userId: string
) => {
  try {
    // Fix agent ID extraction from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    const agentId = pathSegments[2]; // "agents" at 0, "[id]" at 1, actual ID at 2
    
    const {
      date,
      startTime,
      endTime,
      propertyId,
      type,
      notes,
    } = await request.json();
    
    if (!agentId || !isValidObjectId(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!date || !startTime || !endTime || !type) {
      return NextResponse.json(
        { error: 'Date, start time, end time, and type are required' },
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
    
    // If property viewing, validate property
    if (type === 'property-viewing') {
      if (!propertyId || !isValidObjectId(propertyId)) {
        return NextResponse.json(
          { error: 'Valid property ID is required for property viewing' },
          { status: 400 }
        );
      }
      
      const property = await Property.findById(propertyId);
      if (!property) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      
      // Check if agent is associated with the property
      if (property.agent?.toString() !== agentId && property.owner.toString() !== agentId) {
        return NextResponse.json(
          { error: 'Agent is not associated with this property' },
          { status: 403 }
        );
      }
    }
    
    // Get agent's schedule
    const schedule = await AgentSchedule.findOne({ agent: agentId });
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'Agent schedule not found' },
        { status: 404 }
      );
    }
    
    // Check if the appointment date is blocked
    const appointmentDate = new Date(date);
   
    const isDateBlocked = schedule.blockedDates.some((blockedDate: any) =>
      blockedDate.date.toDateString() === appointmentDate.toDateString()
    );
    
    if (isDateBlocked) {
      return NextResponse.json(
        { error: 'Agent is not available on this date' },
        { status: 400 }
      );
    }
    
    // Check if the time slot is within agent's availability
    const dayOfWeek = appointmentDate.getDay();
    if (!isTimeSlotAvailable(dayOfWeek, startTime, endTime, schedule.availability)) {
      return NextResponse.json(
        { error: 'Time slot is outside agent\'s availability' },
        { status: 400 }
      );
    }
    
    // Check for conflicting appointments
  
    const hasConflict = schedule.appointments.some((apt: any) => {
      return (
        apt.date.toDateString() === appointmentDate.toDateString() &&
        apt.status !== 'cancelled' &&
        doTimeSlotsOverlap(startTime, endTime, apt.startTime, apt.endTime)
      );
    });
    
    if (hasConflict) {
      return NextResponse.json(
        { error: 'Time slot conflicts with another appointment' },
        { status: 400 }
      );
    }
    
    // Create appointment
    const appointment = {
      date: appointmentDate,
      startTime,
      endTime,
      client: userId,
      property: propertyId,
      type,
      notes,
      status: 'pending',
    };
    
    schedule.appointments.push(appointment);
    await schedule.save();
    
    return NextResponse.json({
      success: true,
      message: 'Appointment created successfully',
      appointment,
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
      { error: 'An error occurred while creating the appointment' },
      { status: 500 }
    );
  }
}); 