import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Project from '@/app/models/Project';
import BuilderReview from '@/app/models/BuilderReview';
import mongoose from 'mongoose';
// GET a specific builder by ID (from User collection)
export async function GET(req, { params }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        await connectDB();
        const { id } = await params;
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid builder ID' }, { status: 400 });
        }
        // Find the builder by ID in User collection with more fields
        const builder = await User.findOne({
            _id: id,
            isBuilder: true
        }).select('name email image phone bio builderInfo createdAt');
        if (!builder) {
            return NextResponse.json({ error: 'Builder not found' }, { status: 404 });
        }
        // Ensure builderInfo exists and is verified
        if (!builder.builderInfo || !builder.builderInfo.verified) {
            return NextResponse.json({ error: 'Builder not verified or incomplete profile' }, { status: 404 });
        }
        // Fetch builder's projects - include all relevant statuses
        const projects = await Project.find({
            developer: builder._id
        }).select('projectName projectType locality city projectImages projectTagline projectAmenities unitTypes createdAt status possessionDate projectStage');
        console.log(`Found ${projects.length} projects for builder ${builder._id}`);
        console.log('Project statuses:', projects.map(p => ({ name: p.projectName, status: p.status })));
        // Calculate project counts from actual projects
        const completedProjects = projects.filter(p => p.projectStage === 'ready-to-move').length;
        const ongoingProjects = projects.filter(p => p.projectStage === 'under-construction').length;
        // Fetch reviews for the builder
        const reviews = await BuilderReview.find({
            builder: id,
            status: 'approved'
        })
            .sort({ createdAt: -1 })
            .limit(50) // Limit to recent 50 reviews
            .lean();
        // Format the builder data
        const formattedBuilder = {
            _id: builder._id,
            title: ((_a = builder.builderInfo) === null || _a === void 0 ? void 0 : _a.companyName) || builder.name,
            name: builder.name,
            image: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            logo: builder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            projects: projects.length,
            description: `Verified builder with ${((_b = builder.builderInfo) === null || _b === void 0 ? void 0 : _b.experience) || 0} years of experience in real estate development`,
            established: ((_c = builder.builderInfo) === null || _c === void 0 ? void 0 : _c.established) ?
                new Date(builder.builderInfo.established).getFullYear().toString() :
                new Date(builder.createdAt).getFullYear().toString(),
            headquarters: 'Delhi, India',
            specialization: ((_e = (_d = builder.builderInfo) === null || _d === void 0 ? void 0 : _d.specializations) === null || _e === void 0 ? void 0 : _e.join(', ')) || 'Residential, Commercial',
            rating: ((_f = builder.builderInfo) === null || _f === void 0 ? void 0 : _f.rating) || 4.0,
            completed: completedProjects,
            ongoing: ongoingProjects,
            about: builder.bio || `${((_g = builder.builderInfo) === null || _g === void 0 ? void 0 : _g.companyName) || builder.name} is a verified builder committed to delivering quality real estate projects.`,
            projects_list: projects.map(project => ({
                _id: project._id,
                name: project.projectName,
                location: `${project.locality}, ${project.city}`,
                status: project.projectStage === 'ready-to-move' ? 'Completed' : 'Ongoing',
                type: project.projectType,
                images: project.projectImages || [],
                tagline: project.projectTagline,
                amenities: project.projectAmenities || [],
                unitTypes: project.unitTypes || [],
                possessionDate: project.possessionDate
            })),
            contact: {
                email: builder.email,
                phone: builder.phone || '',
                website: '',
                address: 'Delhi, India'
            },
            experience: ((_h = builder.builderInfo) === null || _h === void 0 ? void 0 : _h.experience) || 0,
            verified: ((_j = builder.builderInfo) === null || _j === void 0 ? void 0 : _j.verified) || false,
            reviews: reviews.map(review => ({
                _id: review._id,
                user: review.user,
                rating: review.rating,
                text: review.text,
                date: review.createdAt
            }))
        };
        return NextResponse.json({ builder: formattedBuilder }, { status: 200 });
    }
    catch (error) {
        console.error('Error fetching builder:', error);
        return NextResponse.json({ error: 'Failed to fetch builder' }, { status: 500 });
    }
}
// POST - Add a review to the builder
export async function POST(req, { params }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    try {
        await connectDB();
        const { id } = await params;
        const { user, rating, text } = await req.json();
        // Validate input
        if (!user || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid review data. User and rating (1-5) are required.' }, { status: 400 });
        }
        // Find the builder
        const builder = await User.findOne({
            _id: id,
            isBuilder: true,
            'builderInfo.verified': true
        });
        if (!builder) {
            return NextResponse.json({ error: 'Builder not found' }, { status: 404 });
        }
        // Create new review using BuilderReview model
        const newReview = new BuilderReview({
            builder: id,
            rating,
            text: text || '',
            user,
            status: 'approved' // Auto-approve for now
        });
        await newReview.save();
        // Update builder rating (simple average calculation)
        const currentRating = ((_a = builder.builderInfo) === null || _a === void 0 ? void 0 : _a.rating) || 0;
        const currentReviewCount = ((_b = builder.builderInfo) === null || _b === void 0 ? void 0 : _b.reviewCount) || 0;
        const newRating = ((currentRating * currentReviewCount) + rating) / (currentReviewCount + 1);
        // Update builder info
        await User.findByIdAndUpdate(id, {
            'builderInfo.rating': Math.round(newRating * 10) / 10,
            'builderInfo.reviewCount': currentReviewCount + 1
        });
        // Fetch updated builder data (reuse GET logic)
        const updatedBuilder = await User.findById(id).select('name email image phone bio builderInfo createdAt');
        // Fetch all reviews for the updated response
        const allReviews = await BuilderReview.find({
            builder: id,
            status: 'approved'
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        const formattedBuilder = {
            _id: updatedBuilder._id,
            title: ((_c = updatedBuilder.builderInfo) === null || _c === void 0 ? void 0 : _c.companyName) || updatedBuilder.name,
            name: updatedBuilder.name,
            image: updatedBuilder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            logo: updatedBuilder.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            projects: 0, // You'd calculate this from projects
            description: `Verified builder with ${((_d = updatedBuilder.builderInfo) === null || _d === void 0 ? void 0 : _d.experience) || 0} years of experience in real estate development`,
            established: ((_e = updatedBuilder.builderInfo) === null || _e === void 0 ? void 0 : _e.established) ?
                new Date(updatedBuilder.builderInfo.established).getFullYear().toString() :
                new Date(updatedBuilder.createdAt).getFullYear().toString(),
            headquarters: 'Delhi, India',
            specialization: ((_g = (_f = updatedBuilder.builderInfo) === null || _f === void 0 ? void 0 : _f.specializations) === null || _g === void 0 ? void 0 : _g.join(', ')) || 'Residential, Commercial',
            rating: ((_h = updatedBuilder.builderInfo) === null || _h === void 0 ? void 0 : _h.rating) || 4.0,
            completed: ((_j = updatedBuilder.builderInfo) === null || _j === void 0 ? void 0 : _j.completedProjects) || 0,
            ongoing: ((_k = updatedBuilder.builderInfo) === null || _k === void 0 ? void 0 : _k.ongoingProjects) || 0,
            about: updatedBuilder.bio || `${((_l = updatedBuilder.builderInfo) === null || _l === void 0 ? void 0 : _l.companyName) || updatedBuilder.name} is a verified builder committed to delivering quality real estate projects.`,
            projects_list: [], // You'd fetch projects here
            contact: {
                email: updatedBuilder.email,
                phone: updatedBuilder.phone || '',
                website: '',
                address: 'Delhi, India'
            },
            experience: ((_m = updatedBuilder.builderInfo) === null || _m === void 0 ? void 0 : _m.experience) || 0,
            verified: ((_o = updatedBuilder.builderInfo) === null || _o === void 0 ? void 0 : _o.verified) || false,
            reviews: allReviews.map(review => ({
                _id: review._id,
                user: review.user,
                rating: review.rating,
                text: review.text,
                date: review.createdAt
            }))
        };
        return NextResponse.json({
            builder: formattedBuilder,
            message: 'Review added successfully'
        }, { status: 200 });
    }
    catch (error) {
        console.error('Error adding review:', error);
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
}
