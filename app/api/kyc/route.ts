import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import { sendEmail } from "@/app/lib/utils";

const KycRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  pan: String,
  panImageUrl: String, // Store base64 string for now
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: String,
  email: String,
  postOtp: String,
  postOtpExpiry: Date,
  otpVerified: { type: Boolean, default: false },
});
const KycRequest = mongoose.models.KycRequest || mongoose.model("KycRequest", KycRequestSchema);

function getUserIdFromAuthHeader(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.substring(7);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.userId || payload.sub;
  } catch (error) {
    return null;
  }
}

/**
 * @swagger
 * /api/kyc:
 *   post:
 *     summary: Submit KYC application
 *     description: Submit a new KYC (Know Your Customer) application with personal details and PAN card image. **Authentication required.**
 *     tags:
 *       - KYC
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - pan
 *               - panImage
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the applicant
 *                 example: "Rahul Adepu"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the applicant
 *                 example: "rahul@example.com"
 *               pan:
 *                 type: string
 *                 description: PAN (Permanent Account Number) of the applicant
 *                 pattern: "^[A-Z]{5}[0-9]{4}[A-Z]$"
 *                 example: "ABCDE1234F"
 *               panImage:
 *                 type: string
 *                 format: binary
 *                 description: PAN card image file (JPEG, PNG, etc.)
 *     responses:
 *       200:
 *         description: KYC application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 kyc:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64b29a1234abcd5678ef90ab"
 *                     userId:
 *                       type: string
 *                       example: "64b29a1234abcd5678ef90ac"
 *                     name:
 *                       type: string
 *                       example: "Rahul Adepu"
 *                     pan:
 *                       type: string
 *                       example: "ABCDE1234F"
 *                     status:
 *                       type: string
 *                       enum: [pending, accepted, rejected]
 *                       example: "pending"
 *                     email:
 *                       type: string
 *                       example: "rahul@example.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required"
 *       401:
 *         description: Authentication required or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authentication required. Please provide a valid token."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to submit KYC"
 *   put:
 *     summary: Send OTP for property posting
 *     description: Generate and send OTP to user's email for property posting verification after KYC approval. **Authentication required.**
 *     tags:
 *       - KYC
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent to your email."
 *       400:
 *         description: KYC not accepted or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "KYC not accepted or not found"
 *       401:
 *         description: Authentication required or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authentication required. Please provide a valid token."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to send OTP"
 *   get:
 *     summary: Get KYC requests (Admin only)
 *     description: Retrieve all KYC requests, separated into pending and reviewed categories
 *     tags:
 *       - KYC
 *     responses:
 *       200:
 *         description: KYC requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pending:
 *                   type: array
 *                   description: List of pending KYC requests
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64b29a1234abcd5678ef90ab"
 *                       userId:
 *                         type: string
 *                         example: "64b29a1234abcd5678ef90ac"
 *                       name:
 *                         type: string
 *                         example: "Rahul Adepu"
 *                       pan:
 *                         type: string
 *                         example: "ABCDE1234F"
 *                       email:
 *                         type: string
 *                         example: "rahul@example.com"
 *                       status:
 *                         type: string
 *                         enum: [pending, accepted, rejected]
 *                         example: "pending"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00.000Z"
 *                 reviewed:
 *                   type: array
 *                   description: List of reviewed KYC requests
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64b29a1234abcd5678ef90ab"
 *                       userId:
 *                         type: string
 *                         example: "64b29a1234abcd5678ef90ac"
 *                       name:
 *                         type: string
 *                         example: "Rahul Adepu"
 *                       pan:
 *                         type: string
 *                         example: "ABCDE1234F"
 *                       email:
 *                         type: string
 *                         example: "rahul@example.com"
 *                       status:
 *                         type: string
 *                         enum: [pending, accepted, rejected]
 *                         example: "accepted"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00.000Z"
 *                       reviewedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-16T14:20:00.000Z"
 *                       adminId:
 *                         type: string
 *                         example: "64b29a1234abcd5678ef90ad"
 *                       reason:
 *                         type: string
 *                         example: "Documents verified successfully"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch KYC requests"
 */

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const pan = formData.get("pan") as string;
    const email = formData.get("email") as string | null;
    const panImage = formData.get("panImage");
    
    if (!name || !pan || !panImage) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    
    let panImageUrl = "";
    if (panImage && typeof panImage === "object" && "arrayBuffer" in panImage) {
      const buffer = Buffer.from(await panImage.arrayBuffer());
      panImageUrl = `data:${panImage.type};base64,${buffer.toString("base64")}`;
    }
    
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Authentication required. Please provide a valid token." }, { status: 401 });
    }
    
    const userId = getUserIdFromAuthHeader(authHeader);
    
    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired token. Please login again." }, { status: 401 });
    }
    
    const kyc = await KycRequest.create({
      userId,
      name,
      pan,
      panImageUrl,
      status: "pending",
      email: email || "",
    });
    
    return NextResponse.json({ success: true, kyc });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit KYC" }, { status: 500 });
  }
}

// New endpoint: /api/kyc/send-otp
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Authentication required. Please provide a valid token." }, { status: 401 });
    }
    
    const userId = getUserIdFromAuthHeader(authHeader);
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID or not authenticated" }, { status: 400 });
    }
    
    const kyc = await KycRequest.findOne({ userId, status: "accepted" });
    if (!kyc) {
      return NextResponse.json({ error: "KYC not accepted or not found" }, { status: 400 });
    }
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
    kyc.postOtp = otp;
    kyc.postOtpExpiry = otpExpiry;
    kyc.otpVerified = false;
    await kyc.save();
    
    // Send email
    const emailHtml = `<div style='font-family: Arial, sans-serif;'><h2>Your Property Posting OTP</h2><p>Your OTP is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p></div>`;
    try {
      await sendEmail(kyc.email, "Your Property Posting OTP", emailHtml);
    } catch (e) {
      return NextResponse.json({ error: "Failed to send OTP email", otp }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const all = await KycRequest.find({}).sort({ createdAt: -1 }).lean();
    const pending = all.filter((k) => k.status === "pending");
    const reviewed = all.filter((k) => k.status === "accepted" || k.status === "rejected");
    return NextResponse.json({ pending, reviewed });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch KYC requests" }, { status: 500 });
  }
} 