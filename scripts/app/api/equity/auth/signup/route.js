import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/equity/models/User";
import { hashPassword, generateVerificationCode } from "@/app/lib/utils";
export async function POST(request) {
    try {
        await connectDB();
        const { email, password, name, role } = await request.json();
        if (!email || !password || !name.trim()) {
            return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        const hashedPassword = await hashPassword(password);
        // Generate verification code
        const verificationCode = generateVerificationCode();
        const verificationTokenExpiry = new Date();
        verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "investor",
            verificationToken: verificationCode,
            verificationTokenExpiry,
            emailVerified: false
        });
        await newUser.save();
        // const emailTemplate = getVerificationEmailTemplate(verificationCode);
        // // Try to send email, but don't fail the registration if email fails
        // try {
        //   await sendEmail(email, "Verify your email address", emailTemplate);
        // } catch (emailError) {
        //   console.error("Failed to send verification email:", emailError);
        // }
        return NextResponse.json({
            success: true,
            message: "Account created successfully! Please check your email for verification.",
            userId: newUser._id,
        }, { status: 201 });
    }
    catch (error) {
        console.error("Registration Error:", error);
        if (error instanceof Error) {
            console.error(error.stack);
        }
        return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
    }
}
