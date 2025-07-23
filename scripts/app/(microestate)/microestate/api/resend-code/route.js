import { NextResponse } from 'next/server';
import dbConnect from '@/app/(microestate)/lib/db';
import User from '@/app/models/User';
import { generateVerificationCode, sendEmail, getVerificationEmailTemplate } from '@/app/lib/utils';
export async function POST(request) {
    try {
        const { userId } = await request.json();
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }
        await dbConnect();
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
        }
        const verificationCode = generateVerificationCode();
        const verificationTokenExpiry = new Date();
        verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);
        user.verificationToken = verificationCode;
        user.verificationTokenExpiry = verificationTokenExpiry;
        await user.save();
        const emailTemplate = getVerificationEmailTemplate(verificationCode);
        const emailSent = await sendEmail(user.email, 'Verify your email address', emailTemplate);
        if (!emailSent) {
            return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
        }
        return NextResponse.json({
            success: true,
            message: 'Verification code sent successfully'
        }, { status: 200 });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while resending verification code' }, { status: 500 });
    }
}
