import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";

const KycRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  pan: String,
  panImageUrl: String,
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

/**
 * @swagger
 * /api/kyc/verify-otp:
 *   post:
 *     summary: Verify OTP for property posting
 *     description: |
 *       Verify the OTP received via email for property posting verification.
 *       
 *       **🔐 IMPORTANT: Authentication Required**
 *       - You must authorize with a valid JWT token first
 *       - Click the "Authorize" button (🔒) at the top of the page
 *       - Enter your token in the `bearerAuth` field
 *       - Click "Authorize" to enable this endpoint
 *       
 *       **⚠️ CRITICAL: Use Latest OTP from Database**
 *       - The OTP is stored in the database when you call the PUT `/api/kyc` endpoint
 *       - **You must use the latest OTP value stored in the database**
 *       - OTP expires after 10 minutes
 *       - Check the database for the current OTP value before testing
 *       
 *       **📋 Testing Steps:**
 *       1. Authorize with your JWT token first
 *       2. **Get the latest OTP from the database** (check KYC record)
 *       3. Fill in the request body with the current OTP
 *       4. Click "Execute" to verify the OTP
 *       
 *       **💡 Note:** This endpoint requires a KYC record with status "accepted" and a valid OTP.
 *     tags:
 *       - KYC
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID (alternative to kycId)
 *                 example: "64b29a1234abcd5678ef90ac"
 *               kycId:
 *                 type: string
 *                 description: KYC request ID (alternative to userId)
 *                 example: "64b29a1234abcd5678ef90ab"
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP received via email (use latest from database)
 *                 pattern: "^[0-9]{6}$"
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
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
 *                   example: "OTP verified. You can now post your property."
 *       400:
 *         description: Missing required fields or invalid IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *       401:
 *         description: Invalid OTP or OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid OTP"
 *       404:
 *         description: KYC record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "KYC record not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to verify OTP"
 */

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, kycId, otp } = await req.json();
    console.log("OTP Verification Request:", { userId, kycId, otp });
    
    if (!otp || (!userId && !kycId)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    let kyc;
    if (kycId) {
      if (!mongoose.Types.ObjectId.isValid(kycId)) {
        return NextResponse.json({ error: "Invalid KYC ID" }, { status: 400 });
      }
      kyc = await KycRequest.findById(kycId);
    } else {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
      kyc = await KycRequest.findOne({ userId, status: "accepted" });
    }
    if (!kyc) {
      console.log("KYC not found for:", { userId, kycId });
      return NextResponse.json({ error: "KYC record not found" }, { status: 404 });
    }
    console.log("Found KYC:", { 
      kycId: kyc._id, 
      userId: kyc.userId, 
      status: kyc.status, 
      otpVerified: kyc.otpVerified,
      hasOtp: !!kyc.postOtp,
      otpExpiry: kyc.postOtpExpiry,
      expectedOtp: kyc.postOtp,
      receivedOtp: otp
    });
    
    if (kyc.otpVerified) {
      return NextResponse.json({ success: true, message: "OTP already verified" });
    }
    if (!kyc.postOtp || !kyc.postOtpExpiry) {
      return NextResponse.json({ error: "No OTP generated for this KYC" }, { status: 400 });
    }
    if (kyc.postOtp !== otp) {
      console.log("OTP mismatch:", { expected: kyc.postOtp, received: otp });
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }
    if (new Date() > new Date(kyc.postOtpExpiry)) {
      console.log("OTP expired:", { expiry: kyc.postOtpExpiry, now: new Date() });
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }
    kyc.otpVerified = true;
    await kyc.save();
    return NextResponse.json({ success: true, message: "OTP verified. You can now post your property." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
} 