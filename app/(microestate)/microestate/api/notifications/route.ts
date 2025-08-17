import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import MicroestateUser from "@/app/(microestate)/models/user";
import { sendEmail } from "@/app/(microestate)/lib/utils";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { tenantId, propertyTitle, landlordName, message, type = "tenant_removal" } = await request.json();

    if (!tenantId || !propertyTitle || !landlordName || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the tenant
    const tenant = await MicroestateUser.findById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { success: false, message: "Tenant not found" },
        { status: 404 }
      );
    }

    // Send email notification to tenant
    const emailSubject = `Property Assignment Update - ${propertyTitle}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc3545; margin: 0; font-size: 24px;">Property Assignment Update</h1>
          </div>
          
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <strong>Important Notice:</strong> Your property assignment has been updated.
          </div>
          
          <p style="color: #333; line-height: 1.6; font-size: 16px;">Dear ${tenant.firstName} ${tenant.lastName},</p>
          
          <p style="color: #333; line-height: 1.6; font-size: 16px;">${message}</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Property Details:</h3>
            <p style="margin: 5px 0; color: #6c757d;"><strong>Property:</strong> ${propertyTitle}</p>
            <p style="margin: 5px 0; color: #6c757d;"><strong>Landlord:</strong> ${landlordName}</p>
            <p style="margin: 5px 0; color: #6c757d;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6; font-size: 16px;">
            If you have any questions or concerns about this change, please contact your landlord directly.
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #6c757d; font-size: 14px; text-align: center; margin: 0;">
            This is an automated notification from the MicroEstate platform.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail(tenant.email, emailSubject, emailBody);
      console.log(`✅ Tenant removal notification sent to ${tenant.email}`);
    } catch (emailError) {
      console.error("❌ Failed to send notification email:", emailError);
      // Don't fail the entire operation if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification sent successfully to tenant",
        data: {
          tenantEmail: tenant.email,
          tenantName: `${tenant.firstName} ${tenant.lastName}`,
          notificationType: type
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error sending tenant notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send notification",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
