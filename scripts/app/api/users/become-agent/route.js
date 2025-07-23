import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
// POST /api/users/become-agent - Request to become an agent
export const POST = withAuth(async (request, userId) => {
    try {
        const { licenseNumber, agency, experience, specializations, languages, } = await request.json();
        // Validate required fields
        if (!licenseNumber || !agency || !experience) {
            return NextResponse.json({ error: 'License number, agency, and experience are required' }, { status: 400 });
        }
        await connectDB();
        // Check if user exists and is not already an agent
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (user.isAgent) {
            return NextResponse.json({ error: 'User is already an agent' }, { status: 400 });
        }
        // Update user to become an agent
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                isAgent: true,
                role: 'agent',
                agentInfo: {
                    licenseNumber,
                    agency,
                    experience,
                    specializations: specializations || [],
                    languages: languages || [],
                    verified: false,
                    rating: 0,
                    reviewCount: 0,
                    listings: 0,
                    sales: 0,
                },
            },
        }, {
            new: true,
            runValidators: true,
            select: '-password -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry',
        });
        // TODO: Send notification to admin for verification
        return NextResponse.json({
            success: true,
            message: 'Agent request submitted successfully. Pending verification.',
            user: updatedUser,
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
        return NextResponse.json({ error: 'An error occurred while processing agent request' }, { status: 500 });
    }
});
