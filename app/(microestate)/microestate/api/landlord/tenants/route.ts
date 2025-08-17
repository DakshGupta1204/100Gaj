import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";
import Lease from "@/app/(microestate)/models/Lease";

export const GET = requireLandlord(async (request: NextRequest, context: { userId: string; userEmail: string }) => {
    const { userId } = context;
    await dbConnect();

    try {
        // Find all leases for this landlord with explicit population
        const allLeases = await Lease.find({ landlordId: userId })
            .populate('tenantId', 'firstName lastName email phone')
            .populate('propertyId', 'title address rent');

        if (!allLeases || allLeases.length === 0) {
            return NextResponse.json({ 
                message: "No tenants found for this landlord",
                tenants: []
            }, { status: 200 });
        }

        // Filter out terminated leases (removed tenants)
        const activeLeases = allLeases.filter((lease: any) => lease.status !== 'terminated');

        if (activeLeases.length === 0) {
            return NextResponse.json({ 
                message: "No active tenants found for this landlord",
                tenants: []
            }, { status: 200 });
        }

        // Transform lease data into tenant format for the frontend
        const tenants = activeLeases.map((lease: any) => {
            const tenantFirstName = lease.tenantId?.firstName || '';
            const tenantLastName = lease.tenantId?.lastName || '';
            const tenantFullName = `${tenantFirstName} ${tenantLastName}`.trim();
            
            return {
                _id: lease.tenantId._id || lease.tenantId,
                name: tenantFullName || 'Unknown',
                email: lease.tenantId.email || 'N/A',
                phone: lease.tenantId.phone || 'N/A',
                property: {
                    _id: lease.propertyId._id || lease.propertyId,
                    title: lease.propertyId.title || 'Unknown Property',
                    address: lease.propertyId.address || 'N/A',
                    rent: lease.propertyId.rent || lease.monthlyRent
                },
                rentAmount: lease.monthlyRent,
                status: lease.status === 'active' ? 'active' : 
                       lease.isExpired() ? 'overdue' : 'inactive',
                leaseStart: lease.startDate,
                leaseEnd: lease.endDate,
                leaseId: lease._id
            };
        });

        return NextResponse.json({
            message: "Tenants fetched successfully",
            tenants
        }, { status: 200 });

    } catch (error) {
        console.error("Error while fetching landlord tenants:", error);
        return NextResponse.json({ 
            message: "Error while fetching tenants" 
        }, { status: 500 });
    }
});
