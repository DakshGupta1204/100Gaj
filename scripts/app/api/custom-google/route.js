import { OAuth2Client } from "google-auth-library";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { generateToken } from "@/app/lib/utils";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export async function POST(request) {
    try {
        const { token } = await request.json();
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }
        const { sub, email, name, picture } = payload;
        await connectDB();
        let user = await User.findOne({ googleId: sub });
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                if (!user.googleId) {
                    user.googleId = sub;
                    await user.save();
                }
            }
            else {
                user = await User.create({
                    googleId: sub,
                    email,
                    name,
                    image: picture,
                    emailVerified: new Date(),
                    role: "user",
                });
            }
        }
        const authToken = generateToken({
            userId: user._id,
            email: user.email,
        });
        return new Response(JSON.stringify({
            success: true,
            message: 'Google login successful',
            user,
            token: authToken // Changed from 'authToken' to 'token'
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (_err) {
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
