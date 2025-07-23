import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/mongodb";
import clientPromise from "@/app/lib/mongodb-adapter";
import User from "@/app/models/User";
// Call connectDB to ensure mongoose is connected
connectDB().catch((_error) => {
});
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ user, account: _account, profile }) {
            try {
                // Ensure mongoose connection is established
                await connectDB();
                // Check if user exists in your custom User model
                const email = (user === null || user === void 0 ? void 0 : user.email) || (profile === null || profile === void 0 ? void 0 : profile.email);
                if (!email) {
                    return false;
                }
                let existingUser = await User.findOne({ email }).exec();
                if (!existingUser) {
                    // Create a new user in your custom model
                    try {
                        existingUser = await User.create({
                            name: (user === null || user === void 0 ? void 0 : user.name) || (profile === null || profile === void 0 ? void 0 : profile.name),
                            email: email,
                            emailVerified: new Date(),
                            role: "user", // Default role
                            isAgent: false, // Default to false
                            authMethod: "google",
                            image: (user === null || user === void 0 ? void 0 : user.image) || (profile === null || profile === void 0 ? void 0 : profile.picture),
                        });
                    }
                    catch (_createError) {
                        return false;
                    }
                }
                else {
                    // Update last active time
                    existingUser.lastActive = new Date();
                    await existingUser.save();
                }
                // Generate JWT token for verification
                try {
                    const _jwtToken = jwt.sign({
                        id: existingUser._id.toString(),
                        email: existingUser.email,
                        role: existingUser.role,
                    }, process.env.JWT_SECRET, { expiresIn: "7d" });
                    // Set cookie (will be handled by NextAuth)
                    // Store in session for client-side access
                    return true;
                }
                catch (_jwtError) {
                    return false;
                }
            }
            catch (_error) {
                return false;
            }
        },
        async jwt({ token, user, account: _account }) {
            if (user) {
                token.userId = user.id;
                // Generate custom JWT token
                try {
                    const customToken = jwt.sign({
                        id: user.id,
                        email: user.email,
                        role: "user",
                    }, process.env.JWT_SECRET, { expiresIn: "7d" });
                    token.customToken = customToken;
                }
                catch (_error) {
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.userId;
                session.user.customToken = token.customToken;
            }
            return session;
        },
    },
    pages: {
        signIn: "/",
        signOut: "/",
        error: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
});
export { handler as GET, handler as POST };
