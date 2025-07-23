import connectDB from "@/app/lib/mongodb";
import Portfolio from "@/app/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

// GET /api/portfolio - Get full portfolio breakdown
export async function GET(req: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{
					success: false,
					message: "User ID is required",
				},
				{ status: 400 }
			);
		}

		if (!Types.ObjectId.isValid(userId)) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid user ID format",
				},
				{ status: 400 }
			);
		}

		const portfolio = await Portfolio.findOne({ userId })
			.populate(
				"holdings.propertyId",
				"title address propertyType currentPrice"
			)
			.lean();

		if (!portfolio) {
			return NextResponse.json(
				{
					success: false,
					message: "Portfolio not found",
				},
				{ status: 404 }
			);
		}

		// Calculate real-time portfolio summary
		const summary = {
			...portfolio.summary,
			totalReturnPercentage:
				portfolio.summary.totalInvested > 0
					? ((portfolio.summary.currentValue -
							portfolio.summary.totalInvested) /
							portfolio.summary.totalInvested) *
					  100
					: 0,
		};

		return NextResponse.json(
			{
				success: true,
				message: "Portfolio fetched successfully",
				data: {
					...portfolio,
					summary,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("GET /api/portfolio error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch portfolio",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}

// POST /api/portfolio - Create new portfolio
export async function POST(req: NextRequest) {
	try {
		await connectDB();

		const body = await req.json();

		if (!body.userId) {
			return NextResponse.json(
				{
					success: false,
					message: "User ID is required",
				},
				{ status: 400 }
			);
		}

		if (!Types.ObjectId.isValid(body.userId)) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid user ID format",
				},
				{ status: 400 }
			);
		}

		// Check if portfolio already exists
		const existingPortfolio = await Portfolio.findOne({ userId: body.userId });
		if (existingPortfolio) {
			return NextResponse.json(
				{
					success: false,
					message: "Portfolio already exists for this user",
				},
				{ status: 409 }
			);
		}

		const portfolio = await Portfolio.create({
			userId: body.userId,
			holdings: [],
			summary: {
				totalInvested: 0,
				currentValue: 0,
				totalGainLoss: 0,
				totalDividends: 0,
				totalProperties: 0,
				totalShares: 0,
				avgReturn: 0,
			},
			performance: {
				monthlyReturns: [],
				yearlyReturns: [],
				lastUpdated: new Date(),
			},
		});

		return NextResponse.json(
			{
				success: true,
				message: "Portfolio created successfully",
				data: portfolio,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("POST /api/portfolio error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create portfolio",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}
