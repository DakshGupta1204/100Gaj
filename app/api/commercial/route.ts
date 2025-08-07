import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Types } from "mongoose";
import { verifyToken } from "@/app/lib/utils";
import { CommercialProperty } from "@/app/models/CommercialProperty";

export async function GET() {
  try {
    await connectDB();

    const rawProperties = await CommercialProperty.find(
      {},
      {
        name: 1,
        type: 1,
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
        totalArea: 1,
        occupancyRate: 1,
        totalValue: 1,
        features: 1,
      }
    ).lean();

    const properties = rawProperties.map((property) => ({
      ...property,
      id: (property._id as Types.ObjectId).toString(),
    }));

    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
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

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log(body);

    // 🔐 Extract token from Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = verifyToken(token);

    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const userId = decodedToken.userId; // ✅ Use from token, not from body

    // Destructure from body (excluding userId)
    const {
      propertyType,
      listingCategory = "Fractional Ownership",
      projectName,
      fullAddress,
      pinCode,
      city,
      locality,
      googleMapsPin,
      possessionStatus,
      builtUpArea,
      totalValuation,
      minimumInvestmentTicket,
      customTicketAmount,
      targetRaiseAmount,
      ownershipSplit,
      totalShares,
      sharePercentage,
      rentalYield,
      annualROIProjection,
      minimumHoldingPeriod,
      exitOptions,
      documentsUploaded,
      uploadedDocuments = [],
      images = [],
      virtualTourLink,
      requestVirtualTour,
      brochure,
      highlights = [],
      customHighlights,
      tenantName,
      ownerDetails,
      termsAccepted,
      coordinates,
      status = "pending",
    } = body;

    // ✅ Validations (userId is no longer required from body)
    if (!termsAccepted) {
      return NextResponse.json(
        { error: "Terms must be accepted." },
        { status: 400 }
      );
    }

    if (!images.length || images.length > 10) {
      return NextResponse.json(
        { error: "You must upload between 1 and 10 images." },
        { status: 400 }
      );
    }

    if (
      !ownerDetails ||
      !ownerDetails.name ||
      !ownerDetails.phone ||
      !ownerDetails.email
    ) {
      return NextResponse.json(
        { error: "Missing owner details (name, phone number, or email)" },
        { status: 400 }
      );
    }

    // if (
    //   !coordinates ||
    //   coordinates.lat === undefined ||
    //   coordinates.lng === undefined
    // ) {
    //   return NextResponse.json(
    //     { error: "Missing coordinates (latitude and longitude)" },
    //     { status: 400 }
    //   );
    // }

    // ✅ Create property with userId from token
    const newProperty = await CommercialProperty.create({
      propertyType,
      listingCategory,
      projectName,
      fullAddress,
      pinCode,
      city,
      locality,
      googleMapsPin,
      possessionStatus,
      builtUpArea,
      totalValuation,
      minimumInvestmentTicket,
      customTicketAmount,
      targetRaiseAmount,
      ownershipSplit,
      totalShares,
      sharePercentage,
      rentalYield,
      annualROIProjection,
      minimumHoldingPeriod,
      exitOptions,
      documentsUploaded,
      uploadedDocuments,
      images,
      virtualTourLink,
      requestVirtualTour,
      brochure,
      highlights,
      customHighlights,
      tenantName,
      ownerDetails,
      termsAccepted,
      coordinates,
      status,
      userId, // ✅ safe & verified
    });

    return NextResponse.json(
      {
        message: "Property created successfully",
        propertyId: newProperty._id,
        property: newProperty,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error posting property:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
