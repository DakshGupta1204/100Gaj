import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import { generateVerificationCode, getVerificationEmailTemplate, hashPassword, sendEmail, } from "@/app/lib/utils";
import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        await dbConnect();
        const { email, password, name, role } = await request.json();
        if (!email || !password || !name.trim()) {
            return NextResponse.json({
                error: "Name, email, and password are required",
            }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({
                error: "Password must be at least 8 characters long",
            }, { status: 400 });
        }
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({
                error: "User already exists",
            }, { status: 400 });
        }
        const hashedPassword = await hashPassword(password);
        //verfication code
        const verificationCode = generateVerificationCode();
        const verificationTokenExpiry = new Date();
        verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            verificationToken: verificationCode,
            verificationTokenExpiry,
            isVerified: false
        });
        await newUser.save();
        const emailTemplate = getVerificationEmailTemplate(verificationCode);
        // Try to send email, but don't fail the registration if email fails
        try {
            await sendEmail(email, "Verify your email address", emailTemplate);
        }
        catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Continue with registration even if email fails
        }
        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please check your email for verification code.",
            userId: newUser._id,
            newUser
        }, { status: 201 });
    }
    catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
    }
}
