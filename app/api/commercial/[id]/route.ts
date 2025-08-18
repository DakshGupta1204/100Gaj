import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import CommercialProperties from "@/app/models/CommercialProperty";
import { Types } from "mongoose";

/**
 * @swagger
 * /api/commercial/{id}:
 *   get:
 *     summary: Get a property by ID
 *     description: Fetch a commercial property by its MongoDB ObjectId.
 *     tags:
 *       - Commercial Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66bdbf5a1e48a13d4c78c9f1
 *         description: The unique property ID
 *     responses:
 *       200:
 *         description: Successfully retrieved property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 66bdbf5a1e48a13d4c78c9f1
 *                     name:
 *                       type: string
 *                       example: "Prime Office Space"
 *                     location:
 *                       type: string
 *                       example: "Hyderabad"
 *                     price:
 *                       type: number
 *                       example: 25000000
 *       400:
 *         description: Invalid property ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid property ID
 *       404:
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Property not found
 *       500:
 *         description: Internal server error
 */

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid property ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const property = (await CommercialProperties.findById(id).lean()) as {
      _id: Types.ObjectId;
      [key: string]: any;
    };

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    const responseData = {
      ...property,
      id: property._id.toString(),
    };

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
