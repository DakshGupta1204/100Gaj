import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
// GET /api/users/profile - Get current user's profile
export const GET = withAuth(async (request, userId) => {
    try {
        await connectDB();
        const user = await User.findById(userId).select('-password -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while fetching user profile' }, { status: 500 });
    }
});
// PUT /api/users/profile - Update current user's profile
export const PUT = withAuth(async (request, userId) => {
    try {
        const data = await request.json();
        await connectDB();
        // Fields that cannot be updated directly
        const protectedFields = [
            'password',
            'email',
            'emailVerified',
            'verificationToken',
            'verificationTokenExpiry',
            'resetPasswordToken',
            'resetPasswordTokenExpiry',
            'role',
            'isAgent',
            'agentInfo.verified',
            'agentInfo.rating',
            'agentInfo.reviewCount',
            'agentInfo.listings',
            'agentInfo.sales',
        ];
        // Remove protected fields from update data
        protectedFields.forEach(field => {
            const parts = field.split('.');
            if (parts.length === 2) {
                if (data[parts[0]]) {
                    delete data[parts[0]][parts[1]];
                }
            }
            else {
                delete data[field];
            }
        });
        // Update user profile
        const user = await User.findByIdAndUpdate(userId, {
            $set: data,
            lastActive: new Date(),
        }, {
            new: true,
            runValidators: true,
            select: '-password -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry',
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user,
        });
    }
    catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message,
            }));
            return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
        }
        return NextResponse.json({ error: 'An error occurred while updating user profile' }, { status: 500 });
    }
});
