import connectDB from "@/app/lib/mongodb";
import Portfolio from "@/app/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

// GET /api/portfolio/holdings - Get portfolio holdings
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

		const portfolio = await Portfolio.findOne({ userId }, "holdings")
			.populate(
				"holdings.commercialPropertyId",
				"title address propertyType currentPrice totalPropertyValue"
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

		// Calculate additional metrics for each holding
		const enrichedHoldings = portfolio.holdings.map((holding) => {
			const gainLossPercentage =
				holding.totalInvested > 0
					? ((holding.currentValue - holding.totalInvested) /
							holding.totalInvested) *
					  100
					: 0;

			const totalReturn =
				holding.unrealizedGainLoss +
				holding.realizedGainLoss +
				holding.dividendsReceived;
			const totalReturnPercentage =
				holding.totalInvested > 0
					? (totalReturn / holding.totalInvested) * 100
					: 0;

			return {
				...holding,
				gainLossPercentage,
				totalReturn,
				totalReturnPercentage,
			};
		});

		return NextResponse.json(
			{
				success: true,
				message: "Portfolio holdings fetched successfully",
				data: {
					holdings: enrichedHoldings,
					totalHoldings: enrichedHoldings.length,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("GET /api/portfolio/holdings error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch portfolio holdings",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}

// POST /api/portfolio/holdings - Add new holding
export async function POST(req: NextRequest) {
	try {
		await connectDB();

		const body = await req.json();

		if (
			!body.userId ||
			!body.commercialPropertyId ||
			!body.shares ||
			!body.avgPurchasePrice
		) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Missing required fields: userId, commercialPropertyId, shares, avgPurchasePrice",
				},
				{ status: 400 }
			);
		}

		if (
			!Types.ObjectId.isValid(body.userId) ||
			!Types.ObjectId.isValid(body.commercialPropertyId)
		) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid user ID or property ID format",
				},
				{ status: 400 }
			);
		}

		const portfolio = await Portfolio.findOne({ userId: body.userId });

		if (!portfolio) {
			return NextResponse.json(
				{
					success: false,
					message: "Portfolio not found",
				},
				{ status: 404 }
			);
		}

		const totalInvested = body.shares * body.avgPurchasePrice;
		const currentValue = body.currentValue || totalInvested;
		const purchaseDate = new Date();

		// Check if holding already exists
		const existingHoldingIndex = portfolio.holdings.findIndex(
			(holding) => holding.commercialPropertyId.toString() === body.commercialPropertyId
		);

		if (existingHoldingIndex !== -1) {
			// Update existing holding
			const existingHolding = portfolio.holdings[existingHoldingIndex];
			const newTotalShares = existingHolding.shares + body.shares;
			const newTotalInvested = existingHolding.totalInvested + totalInvested;
			const newAvgPurchasePrice = newTotalInvested / newTotalShares;

			portfolio.holdings[existingHoldingIndex] = {
				...existingHolding,
				shares: newTotalShares,
				avgPurchasePrice: newAvgPurchasePrice,
				totalInvested: newTotalInvested,
				currentValue: existingHolding.currentValue + currentValue,
				lastPurchaseDate: purchaseDate,
			};
		} else {
			// Add new holding
			const newHolding = {
				commercialPropertyId: new Types.ObjectId(body.commercialPropertyId),
				shares: body.shares,
				avgPurchasePrice: body.avgPurchasePrice,
				totalInvested,
				currentValue,
				unrealizedGainLoss: currentValue - totalInvested,
				realizedGainLoss: 0,
				dividendsReceived: 0,
				firstPurchaseDate: purchaseDate,
				lastPurchaseDate: purchaseDate,
				notes: body.notes || "",
			};

			portfolio.holdings.push(newHolding);
		}

		// Update portfolio summary
		portfolio.summary.totalInvested = portfolio.holdings.reduce(
			(sum, holding) => sum + holding.totalInvested,
			0
		);
		portfolio.summary.currentValue = portfolio.holdings.reduce(
			(sum, holding) => sum + holding.currentValue,
			0
		);
		portfolio.summary.totalGainLoss =
			portfolio.summary.currentValue - portfolio.summary.totalInvested;
		portfolio.summary.totalProperties = portfolio.holdings.length;
		portfolio.summary.totalShares = portfolio.holdings.reduce(
			(sum, holding) => sum + holding.shares,
			0
		);
		portfolio.summary.avgReturn =
			portfolio.summary.totalInvested > 0
				? (portfolio.summary.totalGainLoss / portfolio.summary.totalInvested) *
				  100
				: 0;

		await portfolio.save();

		return NextResponse.json(
			{
				success: true,
				message: "Holding added successfully",
				data: portfolio,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("POST /api/portfolio/holdings error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to add holding",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}
