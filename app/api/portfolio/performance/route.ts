import connectDB from "@/app/lib/mongodb";
import Portfolio from "@/app/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

// GET /api/portfolio/performance - Get portfolio performance data
export async function GET(req: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const timeframe = searchParams.get("timeframe") || "all"; // 'monthly', 'yearly', 'all'

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

		const portfolio = await Portfolio.findOne(
			{ userId },
			"performance summary totalReturnPercentage"
		).lean();

		if (!portfolio) {
			return NextResponse.json(
				{
					success: false,
					message: "Portfolio not found",
				},
				{ status: 404 }
			);
		}

		let performanceData = portfolio.performance;

		// Filter data based on timeframe
		if (timeframe === "monthly") {
			performanceData = {
				...performanceData,
				yearlyReturns: [],
			};
		} else if (timeframe === "yearly") {
			performanceData = {
				...performanceData,
				monthlyReturns: [],
			};
		}

		// Calculate additional metrics
		const currentReturn =
			portfolio.summary.totalInvested > 0
				? ((portfolio.summary.currentValue - portfolio.summary.totalInvested) /
						portfolio.summary.totalInvested) *
				  100
				: 0;

		return NextResponse.json(
			{
				success: true,
				message: "Portfolio performance fetched successfully",
				data: {
					performance: performanceData,
					currentReturn,
					totalReturnPercentage: portfolio.totalReturnPercentage,
					summary: {
						totalInvested: portfolio.summary.totalInvested,
						currentValue: portfolio.summary.currentValue,
						totalGainLoss: portfolio.summary.totalGainLoss,
					},
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("GET /api/portfolio/performance error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch portfolio performance",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}
