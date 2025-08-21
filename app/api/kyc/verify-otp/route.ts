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

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { otp } = await req.json();
    
    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }
    
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Authentication required. Please provide a valid token." }, { status: 401 });
    }
    
    const userId = getUserIdFromAuthHeader(authHeader);
    
    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired token. Please login again." }, { status: 401 });
    }
    
    const kyc = await KycRequest.findOne({ userId, status: "accepted" });
    
    if (!kyc) {
      return NextResponse.json({ error: "KYC not accepted or not found" }, { status: 400 });
    }
    
    if (kyc.otpVerified) {
      return NextResponse.json({ error: "OTP already verified" }, { status: 400 });
    }
    
    if (!kyc.postOtp || !kyc.postOtpExpiry) {
      return NextResponse.json({ error: "No OTP found. Please request OTP first." }, { status: 400 });
    }
    
    if (new Date() > kyc.postOtpExpiry) {
      return NextResponse.json({ error: "OTP expired. Please request a new OTP." }, { status: 400 });
    }
    
    if (kyc.postOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }
    
    kyc.otpVerified = true;
    await kyc.save();
    
    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
} 