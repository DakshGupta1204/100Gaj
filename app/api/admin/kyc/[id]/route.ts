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
  // OTP fields for property posting
  postOtp: String,
  postOtpExpiry: Date,
  otpVerified: { type: Boolean, default: false },
});
const KycRequest = mongoose.models.KycRequest || mongoose.model("KycRequest", KycRequestSchema);

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { status, reason } = await req.json();
    const adminIdHeader = req.headers.get("authorization");
    let adminId = undefined;
    if (adminIdHeader && mongoose.Types.ObjectId.isValid(adminIdHeader)) {
      adminId = adminIdHeader;
    }
    const { id } = await context.params;
    console.log('PATCH KYC', { id, status, reason });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid KYC ID:', id);
      return NextResponse.json({ error: "Invalid KYC ID" }, { status: 400 });
    }
    const kyc = await KycRequest.findById(id);
    if (!kyc) {
      console.error('KYC request not found:', id);
      return NextResponse.json({ error: "KYC request not found" }, { status: 404 });
    }
    kyc.status = status;
    kyc.reviewedAt = new Date();
    if (adminId) {
      kyc.adminId = adminId;
    }
    kyc.reason = reason || "";

    // If KYC is accepted, generate OTP for property posting
    if (status === "accepted") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // 10 minutes expiry
      
      kyc.postOtp = otp;
      kyc.postOtpExpiry = otpExpiry;
      kyc.otpVerified = false;
      
      // Note: Email with OTP will be sent when user actually posts a property
      console.log("KYC approved for user:", kyc.email, "OTP generated for property posting");
    }
    await kyc.save();
    
    console.log(`KYC status updated to ${status} for user: ${kyc.email}`);
    
    // Return OTP in response for debugging (remove in production)
    const responseData: { success: boolean; kyc: any; otp?: string } = { success: true, kyc: kyc.toObject() };
    if (status === "accepted" && kyc.postOtp) {
      responseData.otp = kyc.postOtp; // Remove this in production
      console.log("Generated OTP for debugging:", kyc.postOtp);
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('PATCH KYC error:', error);
    return NextResponse.json({ error: "Failed to update KYC status" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const kyc = await KycRequest.findById(id).lean();
    if (!kyc) {
      return NextResponse.json({ error: "KYC request not found" }, { status: 404 });
    }
    return NextResponse.json({ kyc });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch KYC request" }, { status: 500 });
  }
} 