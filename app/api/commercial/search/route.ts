import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Types } from "mongoose";
import { CommercialProperty } from "@/app/models/CommercialProperty";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const propertyType = searchParams.get("propertyType");
    const currentYield = searchParams.get("currentYield");
    const riskLevel = searchParams.get("riskLevel");
    const title = searchParams.get("title");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const sortBy = searchParams.get("sortBy");

    const query: any = {};

    if (propertyType) query.propertyType = propertyType;
    if (city) query["location.city"] = city;
    if (state) query["location.state"] = state;
    if (riskLevel) query.riskLevel = riskLevel;
    if (currentYield) query.currentYield = Number(currentYield);
    if (title) query.title = { $regex: title, $options: "i" };

    if (minPrice || maxPrice) {
      query.pricePerShare = {};
      if (minPrice) query.pricePerShare.$gte = Number(minPrice);
      if (maxPrice) query.pricePerShare.$lte = Number(maxPrice);
    }

    // Determine sorting based on sortBy param
    const sortQuery: Record<string, 1 | -1> = {};
    if (sortBy === "currentYield") {
      sortQuery.currentYield = -1; // Descending
    } else if (sortBy === "pricePerShare") {
      sortQuery.pricePerShare = 1; // Ascending
    } else if (sortBy === "currentOccupancy") {
      sortQuery.currentOccupancy = -1; // Descending
    }

    const rawProperties = await CommercialProperty.find(query, {
      title: 1,
      propertyType: 1,
      location: 1,
      totalShares: 1,
      availableShares: 1,
      pricePerShare: 1,
      currentYield: 1,
      predictedAppreciation: 1,
      riskLevel: 1,
      images: 1,
      description: 1,
      monthlyRental: 1,
      currentOccupancy: 1,
      totalValue: 1,
      features: 1,
      keyTenants: 1,
    })
      .sort(sortQuery)
      .lean();

    const properties = rawProperties.map((property) => ({
      ...property,
      id: (property._id as Types.ObjectId).toString(),
    }));

    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
