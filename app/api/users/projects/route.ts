import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';
import { withAuth } from '@/app/lib/auth-middleware';

// GET /api/users/projects - Get projects for the authenticated user (builder)
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // 'pending', 'active', 'approved', 'rejected'
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const query: any = { developer: userId };
    
    if (status) {
      query.status = status;
    }
    
    const projects = await Project.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    return NextResponse.json({ 
      success: true, 
      count: projects.length,
      projects
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch projects' 
    }, { status: 500 });
  }
});
