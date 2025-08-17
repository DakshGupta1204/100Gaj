import { NextRequest, NextResponse } from "next/server";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";
import dbConnect from "@/app/(microestate)/lib/db";
import MicroestateUser from "@/app/(microestate)/models/user";
import cloudinary from "@/lib/cloudinary";

export const POST = requireLandlord(
  async (request: NextRequest, { userId }: { userId: string }) => {
    console.log("🚀 QR Code upload started for userId:", userId);
    
    try {
      // 1. Connect to database
      console.log("📊 Connecting to database...");
      await dbConnect();
      console.log("✅ Database connected successfully");

      // 2. Parse form data
      console.log("📄 Parsing form data...");
      const formData = await request.formData();
      const file = formData.get("qrCode") as File;
      console.log("📁 File received:", file ? `${file.name} (${file.size} bytes, ${file.type})` : "null");

      if (!file) {
        console.log("❌ No file provided");
        return NextResponse.json(
          { success: false, message: "No file provided" },
          { status: 400 }
        );
      }

      // 3. Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      console.log("🔍 Validating file type:", file.type);
      if (!allowedTypes.includes(file.type)) {
        console.log("❌ Invalid file type:", file.type);
        return NextResponse.json(
          { 
            success: false, 
            message: "Invalid file type. Please upload JPEG, PNG, or WebP images only." 
          },
          { status: 400 }
        );
      }

      // 4. Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      console.log("📏 Validating file size:", file.size, "vs max:", maxSize);
      if (file.size > maxSize) {
        console.log("❌ File too large:", file.size);
        return NextResponse.json(
          { 
            success: false, 
            message: "File size too large. Please upload an image smaller than 5MB." 
          },
          { status: 400 }
        );
      }

      // 5. Check Cloudinary configuration
      console.log("☁️ Checking Cloudinary configuration...");
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error("❌ Missing Cloudinary environment variables");
        return NextResponse.json(
          { success: false, message: "Cloudinary configuration missing" },
          { status: 500 }
        );
      }
      console.log("✅ Cloudinary config present");

      // 6. Convert file to buffer
      console.log("🔄 Converting file to buffer...");
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      console.log("✅ Buffer created, size:", buffer.length);

      // 7. Upload to Cloudinary
      console.log("☁️ Starting Cloudinary upload...");
      const uploadResult = await new Promise((resolve, reject) => {
        const publicId = `qr_${userId}_${Date.now()}`;
        console.log("📝 Using public_id:", publicId);
        
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "microestate/qr-codes",
            transformation: [
              { width: 400, height: 400, crop: "fit" },
              { quality: "auto" },
              { format: "auto" }
            ],
            public_id: publicId,
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("✅ Cloudinary upload successful:", result?.secure_url);
              resolve(result);
            }
          }
        ).end(buffer);
      });

      const cloudinaryResult = uploadResult as any;

      // 8. Find the landlord
      console.log("👤 Finding landlord with ID:", userId);
      const landlord = await MicroestateUser.findById(userId);
      if (!landlord) {
        console.log("❌ Landlord not found:", userId);
        return NextResponse.json(
          { success: false, message: "Landlord not found" },
          { status: 404 }
        );
      }
      console.log("✅ Landlord found:", landlord.email);

      // 9. Delete old QR code from Cloudinary if it exists
      if (landlord.qrCode) {
        console.log("🗑️ Deleting old QR code:", landlord.qrCode);
        try {
          // Extract public_id from the old URL
          const urlParts = landlord.qrCode.split("/");
          const folderAndFile = urlParts.slice(-2); // Get last 2 parts (folder/filename)
          const oldPublicId = folderAndFile.join("/").split(".")[0]; // Remove extension
          console.log("🔍 Extracted old public_id:", oldPublicId);
          
          await cloudinary.uploader.destroy(oldPublicId);
          console.log(`✅ Deleted old QR code: ${oldPublicId}`);
        } catch (deleteError) {
          console.warn("⚠️ Failed to delete old QR code:", deleteError);
          // Don't fail the upload if we can't delete the old image
        }
      }

      // 10. Update landlord with new QR code URL
      console.log("💾 Updating landlord record with new QR code URL...");
      landlord.qrCode = cloudinaryResult.secure_url;
      await landlord.save();
      console.log("✅ Landlord record updated successfully");

      console.log("🎉 QR code upload completed successfully");
      return NextResponse.json(
        {
          success: true,
          message: "QR code uploaded successfully",
          data: {
            qrCodeUrl: cloudinaryResult.secure_url,
            publicId: cloudinaryResult.public_id,
          },
        },
        { status: 200 }
      );

    } catch (error: any) {
      console.error("❌ Error uploading QR code:", error);
      console.error("❌ Error stack:", error.stack);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload QR code",
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
          details: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
  }
);

export const DELETE = requireLandlord(
  async (request: NextRequest, { userId }: { userId: string }) => {
    console.log("🗑️ QR Code deletion started for userId:", userId);
    
    try {
      // 1. Connect to database
      console.log("📊 Connecting to database...");
      await dbConnect();
      console.log("✅ Database connected successfully");

      // 2. Find the landlord
      console.log("👤 Finding landlord with ID:", userId);
      const landlord = await MicroestateUser.findById(userId);
      if (!landlord) {
        console.log("❌ Landlord not found:", userId);
        return NextResponse.json(
          { success: false, message: "Landlord not found" },
          { status: 404 }
        );
      }
      console.log("✅ Landlord found:", landlord.email);

      if (!landlord.qrCode) {
        console.log("❌ No QR code found to delete");
        return NextResponse.json(
          { success: false, message: "No QR code found to delete" },
          { status: 400 }
        );
      }

      console.log("🔍 Current QR code URL:", landlord.qrCode);

      // 3. Delete from Cloudinary
      try {
        console.log("☁️ Deleting from Cloudinary...");
        const urlParts = landlord.qrCode.split("/");
        const folderAndFile = urlParts.slice(-2); // Get last 2 parts (folder/filename)
        const publicId = folderAndFile.join("/").split(".")[0]; // Remove extension
        console.log("🔍 Extracted public_id:", publicId);
        
        const deleteResult = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Cloudinary delete result:`, deleteResult);
      } catch (deleteError) {
        console.warn("⚠️ Failed to delete QR code from Cloudinary:", deleteError);
        // Continue with database deletion even if Cloudinary delete fails
      }

      // 4. Remove QR code from database
      console.log("💾 Updating landlord record to remove QR code...");
      landlord.qrCode = undefined;
      await landlord.save();
      console.log("✅ Landlord record updated successfully");

      console.log("🎉 QR code deletion completed successfully");
      return NextResponse.json(
        {
          success: true,
          message: "QR code deleted successfully",
        },
        { status: 200 }
      );

    } catch (error: any) {
      console.error("❌ Error deleting QR code:", error);
      console.error("❌ Error stack:", error.stack);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete QR code",
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
          details: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
  }
);
