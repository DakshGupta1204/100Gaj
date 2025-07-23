import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { withAuth } from '@/app/lib/auth-middleware';
import mongoose from 'mongoose';
// GET /api/users/favorites/builders - Get all favorite builders for current user
export const GET = withAuth(async (request, userId) => {
    var _a;
    try {
        await connectDB();
        // Get user with populated builder favorites (builders are Users with isBuilder: true)
        const user = await User.findById(userId)
            .populate({
            path: 'favorites.builders',
            model: 'User',
            match: { isBuilder: true },
            select: 'name image builderInfo.companyName builderInfo.rating builderInfo.completedProjects builderInfo.ongoingProjects builderInfo.established builderInfo.specializations'
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Format the builders data to match the expected structure
        const formattedBuilders = (((_a = user.favorites) === null || _a === void 0 ? void 0 : _a.builders) || []).map((builder) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return ({
                _id: builder._id,
                title: ((_a = builder.builderInfo) === null || _a === void 0 ? void 0 : _a.companyName) || builder.name,
                name: builder.name,
                image: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                logo: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                projects: (((_b = builder.builderInfo) === null || _b === void 0 ? void 0 : _b.completedProjects) || 0) + (((_c = builder.builderInfo) === null || _c === void 0 ? void 0 : _c.ongoingProjects) || 0),
                description: `Verified builder with ${((_d = builder.builderInfo) === null || _d === void 0 ? void 0 : _d.experience) || 0} years of experience`,
                established: ((_e = builder.builderInfo) === null || _e === void 0 ? void 0 : _e.established) ?
                    new Date(builder.builderInfo.established).getFullYear().toString() :
                    new Date(builder.createdAt).getFullYear().toString(),
                headquarters: 'Delhi, India',
                specialization: ((_g = (_f = builder.builderInfo) === null || _f === void 0 ? void 0 : _f.specializations) === null || _g === void 0 ? void 0 : _g.join(', ')) || 'Residential, Commercial',
                rating: ((_h = builder.builderInfo) === null || _h === void 0 ? void 0 : _h.rating) || 4.0,
                completed: ((_j = builder.builderInfo) === null || _j === void 0 ? void 0 : _j.completedProjects) || 0,
                ongoing: ((_k = builder.builderInfo) === null || _k === void 0 ? void 0 : _k.ongoingProjects) || 0
            });
        });
        return NextResponse.json({
            favorites: formattedBuilders,
            success: true
        });
    }
    catch (_error) {
        return NextResponse.json({ error: `An error occurred while fetching favorite builders: ${_error.message}` }, { status: 500 });
    }
});
// POST /api/users/favorites/builders - Add a builder to favorites
export const POST = withAuth(async (request, userId) => {
    try {
        const { builderId } = await request.json();
        if (!builderId) {
            return NextResponse.json({ error: 'Builder ID is required' }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(builderId)) {
            return NextResponse.json({ error: 'Invalid builder ID format' }, { status: 400 });
        }
        await connectDB();
        // Check if builder exists in User collection (where isBuilder: true)
        const builder = await User.findOne({
            _id: builderId,
            isBuilder: true
        });
        if (!builder) {
            return NextResponse.json({ error: 'Builder not found' }, { status: 404 });
        }
        // Add to user's favorite builders
        const updatedUser = await User.findByIdAndUpdate(userId, { $addToSet: { 'favorites.builders': builderId } }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Builder added to favorites'
        });
    }
    catch (_error) {
        return NextResponse.json({ error: 'An error occurred while adding builder to favorites' }, { status: 500 });
    }
});
