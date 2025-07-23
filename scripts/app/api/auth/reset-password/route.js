import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { hashPassword } from '@/app/lib/utils';
export async function POST(request) {
    try {
        const { userId, code, newPassword } = await request.json();
        // Input validation
        if (!userId || !code || !newPassword) {
            return NextResponse.json({ error: 'User ID, reset code, and new password are required' }, { status: 400 });
        }
        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
        }
        // Connect to database
        await connectDB();
        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Check reset code
        if (user.resetPasswordToken !== code) {
            return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 });
        }
        // Check if token is expired
        if (user.resetPasswordTokenExpiry && new Date() > user.resetPasswordTokenExpiry) {
            return NextResponse.json({ error: 'Reset code has expired' }, { status: 400 });
        }
        // Hash new password
        const hashedPassword = await hashPassword(newPassword);
        // Update user
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({
            success: true,
            message: 'Password reset successfully'
        }, { status: 200 });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while resetting your password' }, { status: 500 });
    }
}
