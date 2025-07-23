import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Project from '@/app/models/Project';
// GET all verified builders (from User collection)
export async function GET(req) {
    try {
        // Connect to the database
        await connectDB();
        // Get search query from URL if it exists
        const url = new URL(req.url);
        const searchTerm = url.searchParams.get('search') || '';
        let query = {
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
        const buildersWithProjects = await Promise.all(builders.map(async (builder) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const projects = await Project.find({
                developer: builder._id,
                status: { $in: ['active', 'approved'] } // Only show approved/active projects
            }).select('projectName projectType locality city projectImages createdAt status');
            return {
                _id: builder._id,
                title: ((_a = builder.builderInfo) === null || _a === void 0 ? void 0 : _a.companyName) || builder.name,
                name: builder.name,
                image: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                logo: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                projects: projects.length,
                description: `Verified builder with ${((_b = builder.builderInfo) === null || _b === void 0 ? void 0 : _b.experience) || 0} years of experience`,
                established: ((_c = builder.builderInfo) === null || _c === void 0 ? void 0 : _c.established) ?
                    new Date(builder.builderInfo.established).getFullYear().toString() :
                    new Date(builder.createdAt).getFullYear().toString(),
                headquarters: 'Delhi, India', // You might want to add this to builderInfo
                specialization: ((_e = (_d = builder.builderInfo) === null || _d === void 0 ? void 0 : _d.specializations) === null || _e === void 0 ? void 0 : _e.join(', ')) || 'Residential, Commercial',
                rating: ((_f = builder.builderInfo) === null || _f === void 0 ? void 0 : _f.rating) || 4.0,
                completed: ((_g = builder.builderInfo) === null || _g === void 0 ? void 0 : _g.completedProjects) || 0,
                ongoing: ((_h = builder.builderInfo) === null || _h === void 0 ? void 0 : _h.ongoingProjects) || 0,
                email: builder.email,
                projectsList: projects, // Include actual projects
                experience: ((_j = builder.builderInfo) === null || _j === void 0 ? void 0 : _j.experience) || 0,
                verified: ((_k = builder.builderInfo) === null || _k === void 0 ? void 0 : _k.verified) || false
            };
        }));
        return NextResponse.json({ builders: buildersWithProjects }, { status: 200 });
    }
    catch (error) {
        console.error('Error fetching builders:', error);
        return NextResponse.json({ error: 'Failed to fetch builders' }, { status: 500 });
    }
}
