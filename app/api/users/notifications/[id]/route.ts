import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/mongodb';
import Notification from '@/app/models/Notification';
import { withAuth } from '@/app/lib/auth-middleware';

// Helper function to validate ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// GET /api/users/notifications/[id] - Get a specific notification
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const id = request.url.split('/').pop();
    
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid notification ID' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Get notification
    const notification = await Notification.findOne({
      _id: id,
      user: userId,
    }).lean();
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    // If notification is unread, mark it as read
    if (notification && !(notification as any).read) {
      await Notification.findByIdAndUpdate(id, { read: true });
    }
    
    return NextResponse.json(notification);
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while fetching the notification' },
      { status: 500 }
    );
  }
});

// PATCH /api/users/notifications/[id] - Update notification read status
export const PATCH = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const id = request.url.split('/').pop();
    const { read } = await request.json();
    
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid notification ID' },
        { status: 400 }
      );
    }
    
    if (typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'Read status must be a boolean' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Update notification read status
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { read },
      { new: true }
    );
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Notification marked as ${read ? 'read' : 'unread'}`,
      notification,
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while updating the notification' },
      { status: 500 }
    );
  }
});

// DELETE /api/users/notifications/[id] - Delete a notification
export const DELETE = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const id = request.url.split('/').pop();
    
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid notification ID' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Delete notification
    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: userId,
    });
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while deleting the notification' },
      { status: 500 }
    );
  }
}); 