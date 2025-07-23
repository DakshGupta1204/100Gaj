import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils';

export function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Get token from header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized - No token provided' },
          { status: 401 }
        );
      }

      const token = authHeader.split(' ')[1];
      const decodedToken = verifyToken(token);
      
      if (!decodedToken || !decodedToken.userId) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token' },
          { status: 401 }
        );
      }

      // Call the original handler with user ID
      return handler(req, decodedToken.userId);
    } catch (_error) {

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
} 