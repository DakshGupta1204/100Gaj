import { NextResponse } from 'next/server';

// Temporary endpoint to test environment variables in production
export async function GET() {
  return NextResponse.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriPreview: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 20)}...` : 'Not set',
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
