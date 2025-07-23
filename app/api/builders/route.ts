import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Project from '@/app/models/Project';

// GET all verified builders (from User collection)
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();
    
    // Get search query from URL if it exists
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search') || '';
    
    let query: any = {
      isBuilder: true,
      'builderInfo.verified': true
    };
    
    // If search term exists, build a search query
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { 'builderInfo.companyName': { $regex: searchTerm, $options: 'i' } },
        { 'builderInfo.specializations': { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }
    
    // Get verified builders from User collection
    const builders = await User.find(query)
      .select('name email image builderInfo createdAt')
      .sort({ 'builderInfo.rating': -1 });
    
    // For each builder, fetch their projects
    const buildersWithProjects = await Promise.all(
      builders.map(async (builder) => {
        const projects = await Project.find({ 
          developer: builder._id,
          status: { $in: ['active', 'approved'] } // Only show approved/active projects
        }).select('projectName projectType locality city projectImages createdAt status');
        
        return {
          _id: builder._id,
          title: builder.builderInfo?.companyName || builder.name,
          name: builder.name,
          image: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          logo: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          projects: projects.length,
          description: `Verified builder with ${builder.builderInfo?.experience || 0} years of experience`,
          established: builder.builderInfo?.established ? 
            new Date(builder.builderInfo.established).getFullYear().toString() : 
            new Date(builder.createdAt).getFullYear().toString(),
          headquarters: 'Delhi, India', // You might want to add this to builderInfo
          specialization: builder.builderInfo?.specializations?.join(', ') || 'Residential, Commercial',
          rating: builder.builderInfo?.rating || 4.0,
          completed: builder.builderInfo?.completedProjects || 0,
          ongoing: builder.builderInfo?.ongoingProjects || 0,
          email: builder.email,
          projectsList: projects, // Include actual projects
          experience: builder.builderInfo?.experience || 0,
          verified: builder.builderInfo?.verified || false
        };
      })
    );
      
    return NextResponse.json({ builders: buildersWithProjects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching builders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch builders' },
      { status: 500 }
    );
  }
}