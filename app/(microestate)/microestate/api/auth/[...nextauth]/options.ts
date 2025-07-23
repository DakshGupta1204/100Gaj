import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/(microestate)/lib/db";
import User from "@/app/(microestate)/models/user";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

// google provider
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error(
    "Google client credentials are not set in environment variables."
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const foundUser = await User.findOne({ email: credentials.email });

          if (!foundUser) {
            throw new Error("User not found");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            foundUser.password
          );

          if (isPasswordCorrect) {
            // Generate JWT token
            const jwtToken = jwt.sign(
              {
                id: foundUser._id.toString(),
                email: foundUser.email,
                role: foundUser.role,
              },
              process.env.JWT_SECRET!,
              { expiresIn: "7d" }
            );

            // Set the token in the user object to be available in jwt callback
            const userWithToken = {
              ...foundUser.toObject(),
              microauthToken: jwtToken,
            };

            return userWithToken;
          } else {
            throw new Error("Password is incorrect. Please try again.");
          }
        } catch (error: any) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "An error occurred during login");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.microauthToken = user.microauthToken;
        token.id = user._id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.microauthToken = token.microauthToken as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        // For credentials login, we've already handled the user in the authorize callback
        return true;
      }

      // Handle Google OAuth flow
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const email = user.email;
          if (!email) return false;

          let existingUser = await User.findOne({ email }).exec();

          if (!existingUser) {
            existingUser = await User.create({
              name: user.name,
              email: email,
              emailVerified: new Date(),
              role: "tenant",
              authMethod: "google",
              image: user.image,
            });
          }

          // Generate token for Google OAuth users as well
          const jwtToken = jwt.sign(
            {
              id: existingUser._id.toString(),
              email: existingUser.email,
              role: existingUser.role,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
          );

          // Set the token in the user object
          user.microauthToken = jwtToken;

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
