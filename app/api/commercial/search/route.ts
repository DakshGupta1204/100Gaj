import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Types } from "mongoose";
import CommercialProperty from "@/app/models/CommercialProperty";

/**
 * @swagger
 * /api/commercial/search:
 *   get:
 *     summary: Search commercial properties
 *     description: Fetch commercial properties with optional filters, sorting, and pagination.
 *     tags:
 *       - Commercial Properties
 *     parameters:
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *         description: Filter by property type (e.g., warehouse, office, retail)
 *       - in: query
 *         name: currentYield
 *         schema:
 *           type: number
 *         description: Filter by current yield percentage
 *       - in: query
 *         name: riskLevel
 *         schema:
 *           type: string
 *         description: Risk level of property (e.g., Low, Medium, High)
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by property title (partial match allowed)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per share
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per share
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [currentYield, pricePerShare, currentOccupancy]
 *         description: Sort results by yield, price, or occupancy
 *     responses:
 *       200:
 *         description: Successfully retrieved properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       propertyType:
 *                         type: string
 *                       location:
 *                         type: object
 *                         properties:
 *                           city:
 *                             type: string
 *                           state:
 *                             type: string
 *                       totalShares:
 *                         type: number
 *                       availableShares:
 *                         type: number
 *                       pricePerShare:
 *                         type: number
 *                       currentYield:
 *                         type: number
 *                       predictedAppreciation:
 *                         type: number
 *                       riskLevel:
 *                         type: string
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                       description:
 *                         type: string
 *                       monthlyRental:
 *                         type: number
 *                       currentOccupancy:
 *                         type: number
 *                       totalValue:
 *                         type: number
 *                       features:
 *                         type: array
 *                         items:
 *                           type: string
 *                       keyTenants:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Failed to fetch properties
 */

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
