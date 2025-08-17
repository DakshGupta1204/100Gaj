import { requireLandlord } from "@/app/(microestate)/middleware/auth";
import dbConnect from "@/app/(microestate)/lib/db";
import mongoose from "mongoose";
import Lease from "@/app/(microestate)/models/Lease";
import { NextRequest, NextResponse } from "next/server";
import Property from "@/app/(microestate)/models/Property";
import MicroestateUser from "@/app/(microestate)/models/user";
import {
  getTenantWelcomeEmailTemplate,
  sendEmail,
} from "@/app/(microestate)/lib/utils";

// Request body interface
interface AddTenantRequest {
  tenantEmail: string;
  tenantFirstName?: string;
  tenantLastName?: string;
  tenantPhone?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate?: number;
  terms: string;
}

// POST method to add a tenant to a property
export const POST = requireLandlord(
  async (
    request: NextRequest,
    context: { userId: string; userEmail: string }
  ) => {
    // Use MongoDB session for transaction to ensure atomicity
    const session = await mongoose.startSession();

    try {
      await dbConnect();

      const { userId, userEmail } = context;
      console.log("🏗️ Adding tenant to property for landlord:", userId);

      const url = new URL(request.url);
      const propertyId = url.pathname.split("/")[4];

      // Parse request body
      const body: AddTenantRequest = await request.json();
      const {
        tenantEmail,
        tenantFirstName,
        tenantLastName,
        tenantPhone,
        startDate,
        endDate,
        monthlyRent,
        securityDeposit,
        rentDueDate = 1,
        terms,
      } = body;

      // Validate required fields
      if (
        !tenantEmail ||
        !startDate ||
        !endDate ||
        !monthlyRent ||
        !securityDeposit ||
        !terms
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Missing required fields. Please provide tenantEmail, startDate, endDate, monthlyRent, securityDeposit, and terms.",
          },
          { status: 400 }
        );
      }

      // Validate dates
      const leaseStartDate = new Date(startDate);
      const leaseEndDate = new Date(endDate);

      if (isNaN(leaseStartDate.getTime()) || isNaN(leaseEndDate.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid date format. Please use ISO date format (YYYY-MM-DD).",
          },
          { status: 400 }
        );
      }

      if (leaseStartDate >= leaseEndDate) {
        return NextResponse.json(
          {
            success: false,
            message: "End date must be after start date.",
          },
          { status: 400 }
        );
      }

      // Start transaction
      await session.startTransaction();

      // Check if property exists and belongs to the landlord
      const property = await Property.findOne({
        _id: propertyId,
        landlordId: userId,
      }).session(session);

      if (!property) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            message:
              "Property not found or you do not have permission to manage this property.",
          },
          { status: 404 }
        );
      }

      // Check if property is available
      if (property.status !== "available") {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            message: `Property is currently ${property.status} and cannot have a new tenant assigned.`,
          },
          { status: 400 }
        );
      }

      // Check for existing active leases for this property
      const existingActiveLease = await Lease.findOne({
        propertyId,
        status: { $in: ["active", "draft"] },
      }).session(session);

      if (existingActiveLease) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            message:
              "Property already has an active lease. Cannot add another tenant.",
          },
          { status: 400 }
        );
      }

      // Find or create tenant
      let tenant = await MicroestateUser.findOne({
        email: tenantEmail.toLowerCase().trim(),
      }).session(session);

      let isNewTenant = false;
      let generatedPassword = "123456"; // Default password for new tenants

      if (!tenant) {
        // Create new tenant
        isNewTenant = true;
        tenant = new MicroestateUser({
          email: tenantEmail.toLowerCase().trim(),
          password: generatedPassword,
          firstName: tenantFirstName || "New",
          lastName: tenantLastName || "Tenant",
          phone: tenantPhone || "000-000-0000",
          role: "tenant",
        });

        await tenant.save({ session });
        console.log("✅ New tenant created:", tenant._id);
      } else {
        // Check if existing user is not a tenant
        if (tenant.role !== "tenant") {
          await session.abortTransaction();
          return NextResponse.json(
            {
              success: false,
              message:
                "User exists but is not registered as a tenant. Please ask them to update their role or use a different email.",
            },
            { status: 400 }
          );
        }

        // Check if tenant already has an active lease for this property
        const existingTenantLease = await Lease.findOne({
          propertyId,
          tenantId: tenant._id,
          status: { $in: ["active", "draft"] },
        }).session(session);

        if (existingTenantLease) {
          await session.abortTransaction();
          return NextResponse.json(
            {
              success: false,
              message:
                "Tenant already has an active or draft lease for this property.",
            },
            { status: 400 }
          );
        }
      }

      // Create new lease agreement
      const newLease = new Lease({
        propertyId,
        landlordId: userId,
        tenantId: tenant._id,
        startDate: leaseStartDate,
        endDate: leaseEndDate,
        monthlyRent,
        securityDeposit,
        rentDueDate,
        terms,
        status: "active", // Set to active instead of draft
      });

      await newLease.save({ session });
      console.log("✅ New lease created:", newLease._id);

      // Update property status to rented
      property.status = "rented";
      await property.save({ session });
      console.log("✅ Property status updated to rented");

      // Commit the transaction
      await session.commitTransaction();
      console.log("✅ Transaction committed successfully");

      // Send welcome email to new tenant (outside transaction)
      if (isNewTenant) {
        try {
          const data = {
            tenantEmail: tenant.email,
            tenantName: `${tenant.firstName} ${tenant.lastName}`,
            password: generatedPassword,
            propertyTitle: property.title,
            propertyAddress: property.getFullAddress(),
            landlordEmail: String(userEmail) || "",
            leaseStartDate: leaseStartDate.toLocaleDateString(),
            monthlyRent: monthlyRent,
          };

          const emailTemplate = getTenantWelcomeEmailTemplate(data);
          await sendEmail(
            tenant.email,
            `Welcome to ${property.title}`,
            emailTemplate
          );
          console.log(`✅ Welcome email sent to ${tenant.email}`);
        } catch (emailError) {
          console.error("❌ Failed to send welcome email:", emailError);
          // Don't fail the entire operation if email fails
        }
      }

      // Populate the lease with tenant and property details for response
      const populatedLease = await Lease.findById(newLease._id)
        .populate("tenantId", "firstName lastName email phone")
        .populate("propertyId", "title address");

      return NextResponse.json(
        {
          success: true,
          message: isNewTenant
            ? "New tenant account created and added to property successfully. Welcome email sent with login credentials."
            : "Existing tenant successfully added to property. Lease agreement created.",
          data: {
            lease: {
              _id: populatedLease!._id,
              propertyId: populatedLease!.propertyId,
              landlordId: populatedLease!.landlordId,
              tenantId: populatedLease!.tenantId, // Use tenantId instead of tenant for consistency
              startDate: populatedLease!.startDate,
              endDate: populatedLease!.endDate,
              monthlyRent: populatedLease!.monthlyRent,
              securityDeposit: populatedLease!.securityDeposit,
              rentDueDate: populatedLease!.rentDueDate,
              terms: populatedLease!.terms,
              status: populatedLease!.status,
              createdAt: populatedLease!.createdAt,
            },
            property: {
              _id: property._id,
              title: property.title,
              status: property.status,
            },
            isNewTenant,
            ...(isNewTenant
              ? {
                  temporaryPassword: generatedPassword,
                }
              : {}),
          },
        },
        { status: 201 }
      );
    } catch (error: any) {
      // Abort transaction on any error
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("❌ Error in POST /api/properties/[id]/tenant:", error);

      // Handle specific MongoDB errors with more detail
      if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation error",
            error: Object.values(error.errors)
              .map((err) => err.message)
              .join(", "),
          },
          { status: 400 }
        );
      }

      if (error instanceof mongoose.Error.CastError) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid data format provided",
          },
          { status: 400 }
        );
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A tenant with this email already exists for this property",
          },
          { status: 400 }
        );
      }

      // Generic error response
      return NextResponse.json(
        {
          success: false,
          message: "An error occurred while adding tenant to property",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    } finally {
      // Always end the session
      await session.endSession();
    }
  }
);

// GET method to retrieve current tenant(s) for a property
export const GET = requireLandlord(
  async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      await dbConnect();

      // Get property ID from URL params
      const url = new URL(request.url);
      const propertyId = url.pathname.split("/")[4];

      // Check if property belongs to the landlord
      const property = await Property.findOne({
        _id: propertyId,
        landlordId: userId,
      });

      if (!property) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Property not found or you do not have permission to view this property.",
          },
          { status: 404 }
        );
      }

      // Find all active leases for the property
      const activeLeases = await Lease.find({
        propertyId,
        status: { $in: ["active", "draft"] },
      })
        .populate("tenantId", "firstName lastName email phone profileImage")
        .populate("propertyId", "title address")
        .sort({ createdAt: -1 });

      if (!activeLeases || activeLeases.length === 0) {
        return NextResponse.json(
          {
            success: true,
            message: "No current tenants found for this property.",
            data: [],
          },
          { status: 200 }
        );
      }

      // Format response data
      const formattedData = activeLeases.map((lease) => ({
        _id: lease._id,
        tenantId: lease.tenantId,
        propertyId: lease.propertyId,
        startDate: lease.startDate,
        endDate: lease.endDate,
        monthlyRent: lease.monthlyRent,
        securityDeposit: lease.securityDeposit,
        rentDueDate: lease.rentDueDate,
        terms: lease.terms,
        status: lease.status,
        createdAt: lease.createdAt,
      }));

      return NextResponse.json(
        {
          success: true,
          message: "Current tenant information retrieved successfully.",
          data: formattedData,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("❌ Error in GET /api/properties/[id]/tenant:", error);
      return NextResponse.json(
        {
          success: false,
          message: "An error occurred while retrieving tenant information",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }
  }
);

// DELETE method to remove tenant from property (terminate lease)
export const DELETE = requireLandlord(
  async (request: NextRequest, { userId }: { userId: string }) => {
    const session = await mongoose.startSession();

    try {
      await dbConnect();

      // Get property ID from URL params
      const url = new URL(request.url);
      const propertyId = url.pathname.split("/")[4];

      if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid property ID provided",
          },
          { status: 400 }
        );
      }

      // Start transaction
      await session.startTransaction();

      // Check if property belongs to the landlord
      const property = await Property.findOne({
        _id: propertyId,
        landlordId: userId,
      }).session(session);

      if (!property) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            message:
              "Property not found or you do not have permission to manage this property.",
          },
          { status: 404 }
        );
      }

      // Find and terminate all active leases
      const activeLeases = await Lease.find({
        propertyId,
        status: { $in: ["active", "draft"] },
      })
      .populate("tenantId", "firstName lastName email phone")
      .session(session);

      if (!activeLeases || activeLeases.length === 0) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            success: false,
            message: "No active lease found for this property.",
          },
          { status: 404 }
        );
      }

      // Store tenant information for notifications before terminating leases
      const tenantsToNotify = activeLeases.map(lease => {
        const tenant = lease.tenantId as any; // Populated tenant object
        return {
          tenantId: tenant._id,
          tenantName: `${tenant.firstName} ${tenant.lastName}`,
          tenantEmail: tenant.email
        };
      });

      // Terminate all active leases
      await Lease.updateMany(
        {
          propertyId,
          status: { $in: ["active", "draft"] },
        },
        { status: "terminated" }
      ).session(session);

      // Update property status to available
      property.status = "available";
      await property.save({ session });

      // Commit transaction
      await session.commitTransaction();

      // Send notifications to removed tenants (outside transaction)
      for (const tenant of tenantsToNotify) {
        try {
          const notificationMessage = `You have been removed from the property "${property.title}". Your lease has been terminated. If you have questions about this change, please contact your landlord for more information.`;
          
          // Get landlord details for notification
          const landlordUser = await MicroestateUser.findById(userId);
          const landlordName = landlordUser ? `${landlordUser.firstName} ${landlordUser.lastName}` : "Your Landlord";

          // Send email notification directly instead of using axios
          const emailSubject = `Property Assignment Update - ${property.title}`;
          const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #dc3545; margin: 0; font-size: 24px;">Property Assignment Update</h1>
                </div>
                
                <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                  <strong>Important Notice:</strong> Your property assignment has been updated.
                </div>
                
                <p style="color: #333; line-height: 1.6; font-size: 16px;">Dear ${tenant.tenantName},</p>
                
                <p style="color: #333; line-height: 1.6; font-size: 16px;">${notificationMessage}</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="color: #495057; margin-top: 0;">Property Details:</h3>
                  <p style="margin: 5px 0; color: #6c757d;"><strong>Property:</strong> ${property.title}</p>
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

          await sendEmail(tenant.tenantEmail, emailSubject, emailBody);
          console.log(`✅ Notification sent to tenant ${tenant.tenantEmail}`);
        } catch (notificationError) {
          console.error(`❌ Failed to send notification to ${tenant.tenantEmail}:`, notificationError);
          // Don't fail the entire operation if notification fails
        }
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "All tenants successfully removed from property. Leases terminated.",
          data: {
            terminatedLeases: activeLeases.length,
            property: {
              _id: property._id,
              status: property.status,
            },
          },
        },
        { status: 200 }
      );
    } catch (error: any) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("❌ Error in DELETE /api/properties/[id]/tenant:", error);
      return NextResponse.json(
        {
          success: false,
          message: "An error occurred while removing tenant from property",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    } finally {
      await session.endSession();
    }
  }
);
