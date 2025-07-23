import connectDB from "@/app/lib/mongodb";
import Portfolio from "@/app/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

// GET /api/portfolio/summary - Get portfolio summary
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
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

    const portfolio = await Portfolio.findOne({ userId }, 'summary totalReturnPercentage').lean();

    if (!portfolio) {
      return NextResponse.json(
        {
          success: false,
          message: "Portfolio not found",
        },
        { status: 404 }
      );
    }

    // Calculate additional summary metrics
    const totalReturnPercentage = portfolio.summary.totalInvested > 0 
      ? ((portfolio.summary.currentValue - portfolio.summary.totalInvested) / portfolio.summary.totalInvested) * 100 
      : 0;

    const dividendYield = portfolio.summary.totalInvested > 0 
      ? (portfolio.summary.totalDividends / portfolio.summary.totalInvested) * 100 
      : 0;

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio summary fetched successfully",
        data: {
          ...portfolio.summary,
          totalReturnPercentage,
          dividendYield,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/portfolio/summary error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch portfolio summary",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}