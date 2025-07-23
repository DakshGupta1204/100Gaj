import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Project from '@/app/models/Project';
import User from '@/app/models/User';
// Test script to create a sample project for a builder
export async function POST(req) {
    var _a;
    try {
        await connectDB();
        const { builderId } = await req.json();
        if (!builderId) {
            return NextResponse.json({ error: 'Builder ID is required' }, { status: 400 });
        }
        // Verify builder exists
        const builder = await User.findById(builderId);
        if (!builder || !builder.isBuilder) {
            return NextResponse.json({ error: 'Builder not found' }, { status: 404 });
        }
        // Create sample project
        const sampleProject = new Project({
            projectName: "Green Valley Residences",
            projectType: "residential",
            propertyTypesOffered: ["1BHK", "2BHK", "3BHK"],
            projectStage: "under-construction",
            reraRegistrationNo: "RERA12345TEST",
            projectTagline: "Luxury living in the heart of Delhi",
            developerDescription: "A premium residential project offering modern amenities and contemporary living spaces.",
            // Location
            city: "Delhi",
            locality: "Dwarka",
            projectAddress: "Sector 18, Dwarka, New Delhi",
            landmark: "Near Metro Station",
            coordinates: {
                latitude: 28.5921,
                longitude: 77.0460
            },
            distances: {
                airport: 5,
                metro: 0.5,
                school: 1,
                hospital: 2,
                mall: 1.5
            },
            // Configuration
            unitTypes: [
                {
                    type: "1BHK",
                    sizeRange: { min: 500, max: 600, unit: "sqft" },
                    priceRange: { min: 3500000, max: 4200000, perSqft: 7000 }
                },
                {
                    type: "2BHK",
                    sizeRange: { min: 800, max: 1000, unit: "sqft" },
                    priceRange: { min: 5600000, max: 7000000, perSqft: 7000 }
                },
                {
                    type: "3BHK",
                    sizeRange: { min: 1200, max: 1400, unit: "sqft" },
                    priceRange: { min: 8400000, max: 9800000, perSqft: 7000 }
                }
            ],
            paymentPlans: ["CLP", "Flexi", "Construction Linked"],
            bookingAmount: 100000,
            allInclusivePricing: true,
            possessionDate: new Date('2026-12-31'),
            constructionStatus: "Foundation completed",
            // Amenities
            projectAmenities: [
                "Swimming Pool",
                "Gymnasium",
                "Children's Play Area",
                "Clubhouse",
                "24/7 Security",
                "Power Backup",
                "Parking",
                "Garden/Landscaping",
                "Elevator",
                "CCTV Surveillance"
            ],
            unitSpecifications: "Vitrified flooring, modular kitchen, premium fittings",
            greenCertifications: ["IGBC Pre-certified"],
            projectUSPs: [
                "Prime location in Dwarka",
                "Near metro connectivity",
                "Modern amenities",
                "Vastu compliant",
                "Earthquake resistant structure"
            ],
            // Media
            projectImages: [
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
            ],
            floorPlans: [],
            // Developer info
            developer: builderId,
            developerContact: {
                name: builder.name,
                phone: builder.phone || "9999999999",
                email: builder.email,
                affiliation: ((_a = builder.builderInfo) === null || _a === void 0 ? void 0 : _a.companyName) || builder.name
            },
            // Status
            status: "active",
            verified: true
        });
        await sampleProject.save();
        // Update builder's project count
        await User.findByIdAndUpdate(builderId, {
            $inc: { 'builderInfo.ongoingProjects': 1 },
            $push: { 'builderInfo.projects': sampleProject._id }
        });
        return NextResponse.json({
            message: 'Sample project created successfully',
            project: {
                id: sampleProject._id,
                name: sampleProject.projectName,
                type: sampleProject.projectType,
                location: `${sampleProject.locality}, ${sampleProject.city}`
            }
        }, { status: 201 });
    }
    catch (error) {
        console.error('Error creating sample project:', error);
        return NextResponse.json({ error: 'Failed to create sample project' }, { status: 500 });
    }
}
