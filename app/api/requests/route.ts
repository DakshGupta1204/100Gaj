import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import VerificationRequest from "@/app/models/VerificationRequest";
import User from "@/app/models/User";
import { verifyToken } from "@/app/lib/utils";

// GET /api/requests - Get all verification requests
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get session to check if user is admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    // const user = await User.findOne({ email: decodedUser.email });

    // if (!user || user.role !== "admin") {
    //   return NextResponse.json(
    //     { error: "Unauthorized. Admin access required." },
    //     { status: 403 }
    //   );
    // }

    // Get search params
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "pending";
    const type = url.searchParams.get("type");

    // Build query
    
    const query: any = { status };
    if (type) query.type = type;

    // Get requests with user information
    const requests = await VerificationRequest.find(query)
      .populate("userId", "name email phone image")
      .sort({ createdAt: -1 });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (_error) {

    return NextResponse.json(
      { error: "Failed to fetch verification requests" },
      { status: 500 }
    );
  }
}

// POST /api/requests - Create a new verification request
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get session to check if user is logged in
    // const session = await getServerSession();

    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedUser = verifyToken(token);
    // Get request data
    const requestData = await req.json();
    const { type, requestDetails, documents } = requestData;

    if (!type || !["agent", "builder"].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid request type. Must be "agent" or "builder".' },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findOne({ email: decodedUser.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a pending request of this type
    const existingRequest = await VerificationRequest.findOne({
      userId: user._id,
      type,
      status: "pending",
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request of this type" },
        { status: 409 }
      );
    }

    // Create new verification request
    const newRequest = await VerificationRequest.create({
      userId: user._id,
      type,
      requestDetails,
      documents,
    });

    return NextResponse.json(
      {
        message: "Verification request submitted successfully",
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (_error) {

    return NextResponse.json(
      { error: "Failed to submit verification request" },
      { status: 500 }
    );
  }
}
