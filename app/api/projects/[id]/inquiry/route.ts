import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';

// POST /api/projects/[id]/inquiry - Track inquiry
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;

    const project = await Project.findByIdAndUpdate(
      id,
      { $inc: { inquiries: 1 } },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiries: project.inquiries,
    }, { status: 200 });
  } catch (error) {
    console.error('Error tracking inquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track inquiry' },
      { status: 500 }
    );
  }
}
