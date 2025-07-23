import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        await dbConnect();
        const { email, code } = await request.json();
        if (!email || !code) {
            return NextResponse.json({ error: "Email and verification are required!" }, { status: 400 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "email not found" }, { status: 401 });
        }
        if (user.isVerified == true) {
            return NextResponse.json({ error: "User already verified" }, { status: 401 });
        }
        if (user.verificationToken !== code || new Date() > user.verificationTokenExpiry) {
            return NextResponse.json({ error: "Invaild  Code" }, { status: 401 });
        }
        const isCodeVaild = user.verificationToken === code;
        const IsCodeExpired = new Date(user.verificationTokenExpiry) > new Date();
        if (isCodeVaild && IsCodeExpired) {
            user.isVerified = true;
            await user.save();
        }
        return Response.json({
            success: true,
            message: "Account verified sucessfully"
        }, { status: 201 });
    }
    catch (error) {
        console.log("Error while verifying the code", error);
        return Response.json({
            error: "Error While verifying the code"
        }, { status: 401 });
    }
}
