import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const panCard = formData.get("panCard");
    const aadhaarCard = formData.get("aadhaarCard");
    const panNumber = formData.get("panNumber");
    const aadhaarNumber = formData.get("aadhaarNumber");

    // Validate file presence
    if (!panCard || !aadhaarCard) {
      return NextResponse.json({ error: "Both PAN and Aadhaar card images are required." }, { status: 400 });
    }

    // Validate PAN number
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panNumber || typeof panNumber !== "string" || !panRegex.test(panNumber)) {
      return NextResponse.json({ error: "Invalid PAN number format." }, { status: 400 });
    }

    // Validate Aadhaar number
    const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
    if (!aadhaarNumber || typeof aadhaarNumber !== "string" || !aadhaarRegex.test(aadhaarNumber)) {
      return NextResponse.json({ error: "Invalid Aadhaar number format." }, { status: 400 });
    }

    // Simulate file upload success
    return NextResponse.json({ success: true, message: "Documents uploaded and validated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("KYC Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload documents." }, { status: 500 });
  }
} 