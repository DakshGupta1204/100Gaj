import { NextResponse } from "next/server";
import imagekit from "@/app/(microestate)/lib/imagekit";
export async function POST(req) {
    var _a;
    try {
        // Get the uploaded form data
        const formData = await req.formData();
        // Get the file from form data
        const file = formData.get("file");
        // Check if file exists
        if (!file) {
            return NextResponse.json({ error: "Image file is required" }, { status: 400 });
        }
        const fileName = file.name;
        // Check allowed file extensions
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const extension = (_a = fileName.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
            return NextResponse.json({ error: "Only JPG, JPEG, and PNG formats are allowed" }, { status: 400 });
        }
        // Convert file to base64 format
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = file.type;
        const imageData = `data:${mimeType};base64,${base64}`;
        // Upload to ImageKit
        const uploadResult = await imagekit.upload({
            file: imageData,
            fileName: fileName,
        });
        // Return success response with image URL
        return NextResponse.json({
            success: true,
            url: uploadResult.url,
        });
    }
    catch (error) {
        // Handle unexpected errors
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}
