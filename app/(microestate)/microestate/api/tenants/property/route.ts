// properties id 
import { NextRequest , NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import { requireTenant } from "@/app/(microestate)/middleware/auth";
import Lease from "@/app/(microestate)/models/Lease";
import Property from "@/app/(microestate)/models/Property";
import MicroestateUser from "@/app/(microestate)/models/user";

export const GET = requireTenant( async (request: NextRequest, user: { userId: string; userEmail: string; userRole: string }) => {

    const { userId } = user;
    await dbConnect()

    try {
        console.log("🔍 Fetching leases for tenant:", userId);
        
        // Ensure all models are registered before the populate operation
        // This prevents MissingSchemaError during population
        Property; // Registers MicroProperty model
        MicroestateUser; // Registers MicroestateUser model
        
        const allLeases = await Lease.findByTenant(userId);
        console.log("📋 All leases found:", allLeases?.length || 0);

        if (!allLeases || allLeases.length === 0) {
            console.log("❌ No leases found for tenant:", userId);
            return NextResponse.json({ 
                message: "No property assigned to this tenant account",
                activeLeases: [],
                hasTerminatedLeases: false
            }, { status: 404 });
        }

        // Separate active and terminated leases
        const activeLeases = allLeases.filter(lease => 
            lease.status === 'active' || lease.status === 'draft'
        );
        const terminatedLeases = allLeases.filter(lease => 
            lease.status === 'terminated'
        );

        // If no active leases but has terminated leases, tenant was removed
        if (activeLeases.length === 0 && terminatedLeases.length > 0) {
            console.log("⚠️ Tenant has terminated leases but no active ones - tenant was removed");
            return NextResponse.json({ 
                message: "You have been removed from your property. Please contact your landlord for more information.",
                activeLeases: [],
                hasTerminatedLeases: true,
                terminatedLeases: terminatedLeases
            }, { status: 200 });
        }

        // If no active leases and no terminated leases
        if (activeLeases.length === 0) {
            console.log("❌ No active leases found for tenant:", userId);
            return NextResponse.json({ 
                message: "No active property assigned to this tenant account",
                activeLeases: [],
                hasTerminatedLeases: false
            }, { status: 404 });
        }

        console.log("✅ Returning active leases for tenant:", userId);
        return NextResponse.json(activeLeases, { status: 200 });
    } catch (error) {
        console.log("Error while fetching leases:", error);
        return NextResponse.json({ message: "Error while fetching leases" }, { status: 500 });
    }
});

