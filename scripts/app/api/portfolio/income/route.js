import connectDB from "@/app/lib/mongodb";
import Portfolio from "@/app/models/Portfolio";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
// GET /api/portfolio/income - Get portfolio income data
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User ID is required",
            }, { status: 400 });
        }
        if (!Types.ObjectId.isValid(userId)) {
            return NextResponse.json({
                success: false,
                message: "Invalid user ID format",
            }, { status: 400 });
        }
        const portfolio = await Portfolio.findOne({ userId })
            .populate("holdings.commercialPropertyId", "title address")
            .lean();
        if (!portfolio) {
            return NextResponse.json({
                success: false,
                message: "Portfolio not found",
            }, { status: 404 });
        }
        // Calculate income breakdown by property
        const incomeBreakdown = portfolio.holdings.map((holding) => ({
            commercialPropertyId: holding.commercialPropertyId,
            shares: holding.shares,
            dividendsReceived: holding.dividendsReceived,
            realizedGainLoss: holding.realizedGainLoss,
            totalIncome: holding.dividendsReceived + holding.realizedGainLoss,
        }));
        // Calculate total income metrics
        const totalDividends = portfolio.summary.totalDividends;
        const totalRealizedGains = portfolio.holdings.reduce((sum, holding) => sum + holding.realizedGainLoss, 0);
        const totalIncome = totalDividends + totalRealizedGains;
        // Calculate yield
        const currentYield = portfolio.summary.totalInvested > 0
            ? (totalDividends / portfolio.summary.totalInvested) * 100
            : 0;
        return NextResponse.json({
            success: true,
            message: "Portfolio income data fetched successfully",
            data: {
                totalDividends,
                totalRealizedGains,
                totalIncome,
                currentYield,
                incomeBreakdown,
                summary: {
                    totalInvested: portfolio.summary.totalInvested,
                    currentValue: portfolio.summary.currentValue,
                },
            },
        }, { status: 200 });
    }
    catch (error) {
        console.error("GET /api/portfolio/income error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch portfolio income data",
            error: error.message,
        }, { status: 500 });
    }
}
