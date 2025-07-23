import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../lib/db";
import User from "./models/User";

export async function middleware(request: NextRequest) {
  try {
    // Check if the route is an admin route
    if (request.nextUrl.pathname.startsWith("/equity/admin")) {
      // Get the token from the cookies
      const token = request.cookies.get("authToken")?.value;

      if (!token) {
        return NextResponse.redirect(new URL("/equity/auth", request.url));
      }

      try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        // Connect to database
        await connectDB();

        // Find the user and check if they are an admin
        const user = await User.findById(decoded.userId);
        
        if (!user || user.role !== "admin") {
          return NextResponse.redirect(new URL("/equity", request.url));
        }

        // Add user info to headers for the API route
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", decoded.userId);
        requestHeaders.set("x-user-role", user.role);

        // Return response with modified headers
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (error) {
        // If token is invalid, redirect to login
        return NextResponse.redirect(new URL("/equity/auth", request.url));
      }
    }

    // For non-admin routes, continue as normal
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/equity/auth", request.url));
  }
}

// Configure which routes to run the middleware on
export const config = {
  matcher: "/equity/admin/:path*",
}; 