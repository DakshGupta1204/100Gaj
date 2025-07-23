import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { hashPassword, generateVerificationCode, sendEmail, getVerificationEmailTemplate } from '@/app/lib/utils';
export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        // Input validation
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
        }
        // Connect to database
        await connectDB();
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }
        // Hash password
        const hashedPassword = await hashPassword(password);
        // Generate verification code
        const verificationCode = generateVerificationCode();
        const verificationTokenExpiry = new Date();
        verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hours expiry
        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationCode,
            verificationTokenExpiry,
        });
        await newUser.save();
        // Send verification email
        const emailTemplate = getVerificationEmailTemplate(verificationCode);
        await sendEmail(email, 'Verify your email address', emailTemplate);
        return NextResponse.json({
            success: true,
            message: 'User registered successfully. Please check your email for verification code.',
            userId: newUser._id
        }, { status: 201 });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
    }
}
