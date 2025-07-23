import { OAuth2Client } from "google-auth-library";
import User from "@/app/(microestate)/models/user";
import { generateToken } from "@/app/lib/utils";
import dbConnect from "@/app/(microestate)/lib/db";
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
export async function POST(request) {
    try {
        console.log("Received Google login request");
        const { token } = await request.json();
        // Verify the token
        console.log("Verifying Google token...");
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            console.error("Invalid token: No payload");
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }
        const { sub, email, name, picture } = payload;
        console.log(`Token verified for user: ${email}`);
        try {
            console.log("Connecting to database...");
            await dbConnect(); // Make sure this is awaited
            console.log("Database connected successfully");
            let user = await User.findOne({ googleId: sub });
            console.log("User found by googleId:", user ? "Yes" : "No");
            if (!user) {
                // Check if user exists with this email
                user = await User.findOne({ email });
                if (user) {
                    // Update existing user with Google ID
                    user.googleId = sub;
                    await user.save();
                    console.log("Updated existing user with Google ID");
                }
                else {
                    // Create new user
                    user = await User.create({
                        googleId: sub,
                        email,
                        name,
                        image: picture,
                        emailVerified: new Date(),
                        role: "tenant",
                    });
                    console.log("Created new user");
                }
            }
            const microauthToken = generateToken({
                userId: user._id.toString(),
                email: user.email,
            });
            return new Response(JSON.stringify({
                success: true,
                message: 'Google login successful',
                user,
                token: microauthToken
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
        catch (dbError) {
            console.error("Database error:", dbError);
            return new Response(JSON.stringify({
                success: false,
                message: "Database error",
                error: dbError.message
            }), { status: 500 });
        }
    }
    catch (err) {
        console.error("Google Auth Error:", err);
        return new Response(JSON.stringify({
            success: false,
            message: "Authentication failed",
            error: err.message
        }), { status: 500 });
    }
}
