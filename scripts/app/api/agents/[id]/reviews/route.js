import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Review from "@/app/models/Review";
import User from "@/app/models/User";
import { withAuth } from "@/app/lib/auth-middleware";
import mongoose from "mongoose";
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// Helper function to update agent rating
async function updateAgentRating(agentId) {
    var _a;
    const [totalRating, reviewCount] = await Promise.all([
        Review.aggregate([
            {
                $match: {
                    agent: new mongoose.Types.ObjectId(agentId),
                    status: "approved",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRating: { $sum: "$rating" },
                },
            },
        ]),
        Review.countDocuments({
            agent: agentId,
            status: "approved",
        }),
    ]);
    const averageRating = reviewCount > 0 ? ((_a = totalRating[0]) === null || _a === void 0 ? void 0 : _a.totalRating) / reviewCount : 0;
    await User.findByIdAndUpdate(agentId, {
        $set: {
            "agentInfo.rating": averageRating,
            "agentInfo.reviewCount": reviewCount,
        },
    });
}
// GET /api/agents/[id]/reviews - Get reviews for an agent
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid agent ID format" }, { status: 400 });
        }
        await connectDB();
        // Check if agent exists
        const agent = await User.findOne({
            _id: id,
            isAgent: true,
            "agentInfo.verified": true,
        });
        if (!agent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;
        // Get approved reviews
        const reviews = await Review.find({
            agent: id,
            status: "approved",
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("reviewer", "name image")
            .populate("propertyTransaction", "title address")
            .lean(); // Use lean() for better performance
        // Get total count
        const total = await Review.countDocuments({
            agent: id,
            status: "approved",
        });
        // Get rating stats
        const ratingStats = await Review.aggregate([
            {
                $match: {
                    agent: new mongoose.Types.ObjectId(id),
                    status: "approved",
                },
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 },
                },
            },
        ]);
        // Format rating stats
        const stats = {
            average: agent.agentInfo.rating,
            total: agent.agentInfo.reviewCount,
            distribution: Object.fromEntries(ratingStats.map((stat) => [stat._id, stat.count])),
        };
        // Format reviews to use userName when available
        const formattedReviews = reviews.map((review) => {
            var _a;
            return (Object.assign(Object.assign({}, review), { user: review.userName || ((_a = review.reviewer) === null || _a === void 0 ? void 0 : _a.name) || 'Anonymous User' }));
        });
        return NextResponse.json({
            reviews: formattedReviews,
            stats,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (_error) {
        return NextResponse.json({ error: "An error occurred while fetching agent reviews" }, { status: 500 });
    }
}
// POST /api/agents/[id]/reviews - Create a review for an agent
export const POST = withAuth(async (request, userId) => {
    try {
        // Extract agent ID from URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split("/").filter((segment) => segment);
        const agentId = pathSegments[2]; // "agents" at 0, "id" at 1, actual ID at 2
        const { rating, comment, title, propertyTransaction, userName } = await request.json();
        if (!isValidObjectId(agentId)) {
            return NextResponse.json({ error: "Invalid agent ID format" }, { status: 400 });
        }
        // Validate required fields
        if (!rating || !comment || !title) {
            return NextResponse.json({ error: "Rating, comment, and title are required" }, { status: 400 });
        }
        await connectDB();
        // Check if agent exists
        const agent = await User.findOne({
            _id: agentId,
            isAgent: true,
            "agentInfo.verified": true,
        });
        if (!agent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }
        // Don't allow self-reviews
        // if (agentId === userId) {
        //   return NextResponse.json(
        //     { error: "You cannot review yourself" },
        //     { status: 400 },
        //   );
        // }
        // Check if user has already reviewed this agent
        const existingReview = await Review.findOne({
            agent: agentId,
            reviewer: userId,
        });
        if (existingReview) {
            return NextResponse.json({ error: "You have already reviewed this agent" }, { status: 400 });
        }
        // Create review
        const review = new Review({
            agent: agentId,
            reviewer: userId,
            rating,
            title,
            comment,
            userName, // Store the custom userName
            propertyTransaction,
            status: "pending", // Reviews need approval before being public
        });
        await review.save();
        // If auto-approval is enabled, approve the review and update agent rating
        // For now, let's auto-approve reviews
        review.status = "approved";
        await review.save();
        await updateAgentRating(agentId);
        return NextResponse.json({
            success: true,
            message: "Review submitted successfully",
            review,
        }, { status: 201 });
    }
    catch (error) {
        // Handle validation errors
        if (error.name === "ValidationError") {
            const validationErrors = Object.keys(error.errors).map((key) => ({
                field: key,
                message: error.errors[key].message,
            }));
            return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 });
        }
        return NextResponse.json({ error: "An error occurred while creating the review" }, { status: 500 });
    }
});
