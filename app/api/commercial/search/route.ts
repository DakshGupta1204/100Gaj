import { NextRequest, NextResponse } from "next/server";
import CommercialProperties from "@/app/models/CommercialProperty";
import connectDB from "@/app/lib/mongodb";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const currentYield = searchParams.get("currentYield");
    const riskLevel = searchParams.get("riskLevel");
    const name = searchParams.get("name");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const query: any = {};

    if (type) query.type = type;
    if (city) query["location.city"] = city;
    if (state) query["location.state"] = state;
    if (riskLevel) query.riskLevel = riskLevel;
    if (currentYield) query.currentYield = Number(currentYield);
    if (name) query.name = { $regex: name, $options: "i" }; // case-insensitive match

    if (minPrice || maxPrice) {
      query.pricePerShare = {};
      if (minPrice) query.pricePerShare.$gte = Number(minPrice);
      if (maxPrice) query.pricePerShare.$lte = Number(maxPrice);
    }

    const rawProperties = await CommercialProperties.find(query, {
      name: 1,
      type: 1,
      location: 1,
      totalShares: 1,
      availableShares: 1,
      pricePerShare: 1,
      currentYield: 1,
      predictedAppreciation: 1,
      riskLevel: 1,
      image: 1,
      description: 1,
      rentalIncome: 1,
      occupancyRate: 1,
      totalValue: 1,
      features: 1,
    }).lean();

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
