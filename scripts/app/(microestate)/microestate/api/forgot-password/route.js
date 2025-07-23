import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import dbConnect from '@/app/(microestate)/lib/db';
import { generateVerificationCode, sendEmail, getPasswordResetEmailTemplate } from '@/app/lib/utils';
export async function POST(request) {
    await dbConnect();
    try {
        const { email } = await request.json();
        if (!email) {
            console.error("Email is required! ");
        }
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return NextResponse.json({ error: 'Email does not exist in our database' }, { status: 400 });
        }
        const resetCode = generateVerificationCode();
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
        foundUser.resetPasswordToken = resetCode;
        foundUser.resetPasswordTokenExpiry = resetTokenExpiry;
        await User.updateOne({ _id: foundUser._id
        }, {
            $set: {
                resetPasswordToken: resetCode,
                resetPasswordTokenExpiry: resetTokenExpiry,
            }
        });
        const emailTemplate = getPasswordResetEmailTemplate(resetCode);
        sendEmail(email, 'Reset your password', emailTemplate);
        return NextResponse.json({
            success: true,
            message: 'Verification code send sucessfully Check your email ',
            userId: foundUser._id
        }, { status: 200 });
    }
    catch (error) {
        console.error('Error in password reset:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}
