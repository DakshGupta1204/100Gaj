import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import { comparePassword } from "@/app/lib/utils";
export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({
                error: "Email and password are required"
            }, { status: 500 });
        }
        // finding the user in database
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                error: "User Does not exists"
            }, { status: 500 });
        }
        // checking the password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "password is incorrect" }, { status: 401 });
        }
        return NextResponse.json({
            message: "Logged In sucessfully",
            user
        }, { status: 201 });
    }
    catch (error) {
        console.log("Error while sigin up the user ", error);
        return NextResponse.json({
            error: "Error while sigining the user"
        }, { status: 501 });
    }
}
