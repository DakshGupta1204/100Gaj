import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import CommercialProperties from "@/app/models/CommercialProperty";
import { Types } from "mongoose";
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();
        if (!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid property ID" }, { status: 400 });
        }
        await connectDB();
        const property = (await CommercialProperties.findById(id).lean());
        if (!property) {
            return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
        }
        const responseData = Object.assign(Object.assign({}, property), { id: property._id.toString() });
        return NextResponse.json({ success: true, data: responseData }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error.message,
        }, { status: 500 });
    }
}
