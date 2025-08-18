import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Types } from "mongoose";
import CommercialProperty from "@/app/models/CommercialProperty";
import cloudinary from "@/lib/cloudinary";

/**
 * @swagger
 * /api/commercial:
 *   get:
 *     summary: Get all commercial properties
 *     description: Fetches all commercial properties with computed fields like riskLevel, predictedAppreciation, etc.
 *     tags:
 *       - Commercial
 *     responses:
 *       200:
 *         description: List of commercial properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "64b29a1234abcd5678ef90ab"
 *                       name:
 *                         type: string
 *                         example: "DLF Cyber City Tower"
 *                       type:
 *                         type: string
 *                         example: "Office"
 *                       riskLevel:
 *                         type: string
 *                         enum: [Low, Medium, High]
 *                         example: Medium
 */

export async function GET() {
  try {
    await connectDB();

    const rawProperties = await CommercialProperty.find(
      {},
      {
        title: 1,
        projectName: 1,
        propertyType: 1,
        location: 1,
        locality: 1,
        address: 1,
        totalShares: 1,
        availableShares: 1,
        pricePerShare: 1,
        currentYield: 1,
        appreciationRate: 1,
        currentROI: 1,
        status: 1,
        images: 1,
        description: 1,
        monthlyRental: 1,
        totalArea: 1,
        currentOccupancy: 1,
        totalPropertyValue: 1,
        totalValuation: 1,
        features: 1,
        highlights: 1,
        amenities: 1,
        possessionStatus: 1,
        ownerDetails: 1,
        virtualTourLink: 1,
        featured: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).lean();

    const properties = rawProperties.map((property) => ({
      ...property,
      id: (property._id as Types.ObjectId).toString(),
      // Add computed fields for backward compatibility
      name: property.projectName || property.title,
      type: property.propertyType,
      riskLevel: getRiskLevel(property.currentROI || 0),
      predictedAppreciation: property.appreciationRate,
      occupancyRate: property.currentOccupancy,
      totalValue: property.totalPropertyValue,
    }));

    return NextResponse.json({ success: true, data: properties });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to determine risk level based on ROI
function getRiskLevel(roi: number): "Low" | "Medium" | "High" {
  if (roi < 6) return "Low";
  if (roi < 12) return "Medium";
  return "High";
}

/**
 * @swagger
 * /api/commercial:
 *   post:
 *     summary: Submit a new commercial property
 *     description: Creates a new commercial property listing. Requires authentication.
 *     tags:
 *       - Commercial
 *     security:
 *       - bearerAuth: []   # <-- Adds Authorization header in Swagger UI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyType
 *               - projectName
 *               - fullAddress
 *               - pinCode
 *               - locality
 *               - possessionStatus
 *               - builtUpArea
 *               - totalValuation
 *               - minimumInvestmentTicket
 *               - ownerDetails
 *               - termsAccepted
 *             properties:
 *               propertyType:
 *                 type: string
 *                 example: "Office"
 *               projectName:
 *                 type: string
 *                 example: "Cyber Hub Gurgaon"
 *               fullAddress:
 *                 type: string
 *                 example: "Cyber Hub Road, Gurgaon, Haryana"
 *               pinCode:
 *                 type: string
 *                 example: "122002"
 *               locality:
 *                 type: string
 *                 example: "Gurgaon"
 *               possessionStatus:
 *                 type: string
 *                 example: "Ready to Move"
 *               builtUpArea:
 *                 type: string
 *                 example: "2500 sq.ft"
 *               totalValuation:
 *                 type: number
 *                 example: 50000000
 *               minimumInvestmentTicket:
 *                 type: string
 *                 example: "₹25,000"
 *               customTicketAmount:
 *                 type: number
 *                 nullable: true
 *                 example: 100000
 *               ownerDetails:
 *                 type: object
 *                 required:
 *                   - name
 *                   - phone
 *                   - email
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Rahul Adepu"
 *                   phone:
 *                     type: string
 *                     example: "+91-9876543210"
 *                   email:
 *                     type: string
 *                     example: "rahul@example.com"
 *               termsAccepted:
 *                 type: boolean
 *                 example: true
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://ik.imagekit.io/xyz/commercial/property1.jpg"
 *     responses:
 *       201:
 *         description: Property submitted successfully
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
 *                   example: "Commercial property submitted successfully for approval!"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Server error
 */

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    let formData;
    let imageFiles: File[] = [];

    // Check content type to determine how to parse the request
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Parse FormData (when images are uploaded)
      const formDataPayload = await req.formData();
      const formDataString = formDataPayload.get("formData") as string;
      formData = JSON.parse(formDataString);

      // Get uploaded images
      for (const [key, value] of formDataPayload.entries()) {
        if (key === "images" && value instanceof File) {
          imageFiles.push(value);
        }
      }
    } else {
      // Parse JSON (when no images)
      formData = await req.json();
    }

    // Upload images to Cloudinary (if any). If client already uploaded to ImageKit
    // via /api/upload and sent URLs in formData.images, prefer those.
    let uploadedImages: string[] = [];
    if (
      Array.isArray(formData.images) &&
      formData.images.every(
        (u: any) => typeof u === "string" && u.startsWith("http")
      )
    ) {
      uploadedImages = formData.images; // trust pre-uploaded URLs
    } else if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "commercial-properties",
                  resource_type: "image",
                  transformation: [
                    {
                      width: 1200,
                      height: 800,
                      crop: "limit",
                      quality: "auto",
                    },
                  ],
                },
                (error: any, result: any) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              )
              .end(buffer);
          });
          uploadedImages.push((uploadResult as any).secure_url);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
        }
      }
    }

    // Transform form data to match the database schema
    const propertyData = {
      // Basic property information
      title: formData.projectName || "Untitled Property",
      description:
        formData.customHighlights ||
        `Commercial property in ${formData.locality}, ${formData.city}`,
      location: `${formData.locality}, ${formData.city}`,

      // Address details
      address: {
        street: formData.fullAddress || "",
        city: formData.city || "Delhi",
        state: "Delhi", // Default to Delhi as per form
        zipCode: formData.pinCode || "",
        coordinates:
          formData.coordinates?.latitude && formData.coordinates?.longitude
            ? [
                parseFloat(formData.coordinates.longitude),
                parseFloat(formData.coordinates.latitude),
              ]
            : [77.209, 28.6139], // Default Delhi coordinates
      },

      // Form-specific fields
      projectName: formData.projectName,
      fullAddress: formData.fullAddress,
      pinCode: formData.pinCode,
      locality: formData.locality,
      googleMapsPin: formData.googleMapsPin,
      possessionStatus: formData.possessionStatus,
      totalValuation: parseFloat(formData.totalValuation) || 0,
      minimumInvestmentTicket: formData.minimumInvestmentTicket,
      customTicketAmount: formData.customTicketAmount
        ? parseFloat(formData.customTicketAmount)
        : undefined,

      // Property type mapping
      propertyType: mapFormPropertyTypeToSchema(formData.propertyType),

      // Area and year
      totalArea: parseFloat(formData.builtUpArea) || 0,
      builtYear: new Date().getFullYear(), // Default to current year if not provided

      // Investment details - calculate from form data
      totalPropertyValue: parseFloat(formData.totalValuation) * 10000000 || 0, // Convert crores to rupees
      totalShares: calculateTotalShares(formData),
      availableShares: calculateTotalShares(formData),
      pricePerShare: calculatePricePerShare(formData),
      minInvestment: getMinInvestmentAmount(formData),

      // Fractional investment parameters
      targetRaiseAmount: parseFloat(formData.targetRaiseAmount) || undefined,
      ownershipSplit: formData.ownershipSplit,
      sharePercentage: parseFloat(formData.sharePercentage) || undefined,
      minimumHoldingPeriod: formData.minimumHoldingPeriod,
      exitOptions: formData.exitOptions || [],

      // Returns - use form data or defaults
      currentROI: parseFloat(formData.annualROIProjection) || 8, // Default 8%
      currentYield: parseFloat(formData.rentalYield) || 6, // Default 6%
      appreciationRate: parseFloat(formData.annualROIProjection) || 8,

      // Occupancy defaults
      currentOccupancy: 85, // Default 85% occupancy
      monthlyRental: calculateMonthlyRental(formData),

      // Status and features
      status: "pending_approval", // New properties need approval
      featured: false,

      // Property highlights and features
      highlights: formData.highlights || [],
      customHighlights: formData.customHighlights,
      tenantName: formData.tenantName,
      features: formData.highlights || [],
      amenities: [],
      nearbyLandmarks: [],

      // Media
      images: uploadedImages, // Use uploaded images from Cloudinary
      virtualTourLink: formData.virtualTourLink,
      requestVirtualTour: formData.requestVirtualTour || false,

      // Documents
      documents: [],
      documentsUploaded: formData.documentsUploaded || false,

      // Owner/Contact details
      ownerDetails: {
        name: formData.ownerDetails?.name || "",
        phone: formData.ownerDetails?.phone || "",
        email: formData.ownerDetails?.email || "",
        companyName: formData.ownerDetails?.companyName || "",
      },

      // Legal
      termsAccepted: formData.termsAccepted || false,

      // Optional SPV details (can be generated later)
      spvId: `SPV_${Date.now()}`,
      spvName: `${formData.projectName} SPV`,
    };

    // Validate required fields
    const validationErrors = validatePropertyData(propertyData);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    const newProperty = await CommercialProperty.create(propertyData);

    return NextResponse.json(
      {
        success: true,
        message: "Property submitted successfully for approval",
        data: newProperty,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating property:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create property",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper functions
function mapFormPropertyTypeToSchema(formPropertyType: string): string {
  const mapping: Record<string, string> = {
    "commercial-office": "Office",
    "retail-shop": "Retail",
    "co-working-space": "Co-working",
    "warehousing-industrial": "Warehouse",
  };
  return mapping[formPropertyType] || "Office";
}

function calculateTotalShares(formData: any): number {
  const totalValue = parseFloat(formData.totalValuation) * 10000000; // Convert crores to rupees
  const minInvestment = getMinInvestmentAmount(formData);

  if (!totalValue || !minInvestment) {
    return 1000; // Fallback to 1000 shares
  }

  // Calculate total shares based on minimum investment
  // This ensures each share is worth approximately the minimum investment amount
  const calculatedShares = Math.round(totalValue / minInvestment);

  // Ensure reasonable share count (between 100 and 10000)
  const minShares = 100;
  const maxShares = 10000;

  return Math.max(minShares, Math.min(maxShares, calculatedShares));
}

function calculatePricePerShare(formData: any): number {
  const totalValue = parseFloat(formData.totalValuation) * 10000000; // Convert crores to rupees
  const totalShares = calculateTotalShares(formData);
  return Math.round(totalValue / totalShares);
}

function getMinInvestmentAmount(formData: any): number {
  if (formData.minimumInvestmentTicket === "Custom Amount") {
    return parseFloat(formData.customTicketAmount) || 10000;
  }

  const ticketMapping: Record<string, number> = {
    "₹10,000": 10000,
    "₹25,000": 25000,
    "₹50,000": 50000,
  };

  return ticketMapping[formData.minimumInvestmentTicket] || 10000;
}

function calculateMonthlyRental(formData: any): number {
  const totalValue = parseFloat(formData.totalValuation) * 10000000;
  const rentalYield = parseFloat(formData.rentalYield) || 6;
  return Math.round((totalValue * rentalYield) / (100 * 12)); // Monthly rental
}

function validatePropertyData(data: any): string[] {
  const errors: string[] = [];

  if (!data.projectName) errors.push("Project name is required");
  if (!data.fullAddress) errors.push("Full address is required");
  if (!data.pinCode) errors.push("Pin code is required");
  if (!data.locality) errors.push("Locality is required");
  if (!data.possessionStatus) errors.push("Possession status is required");
  if (!data.totalValuation || data.totalValuation <= 0)
    errors.push("Valid total valuation is required");
  if (!data.minimumInvestmentTicket)
    errors.push("Minimum investment ticket is required");
  if (!data.ownerDetails?.name) errors.push("Owner name is required");
  if (!data.ownerDetails?.phone) errors.push("Owner phone is required");
  if (!data.ownerDetails?.email) errors.push("Owner email is required");
  if (!data.termsAccepted) errors.push("Terms and conditions must be accepted");

  return errors;
}
