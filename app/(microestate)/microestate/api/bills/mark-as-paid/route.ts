import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(microestate)/lib/db";
import UtilityBill from "@/app/(microestate)/models/Utility";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";


// mark as paid bill required Landlord!!

export const POST = requireLandlord(
    async (request: NextRequest , context: any) => {
        try {
            await dbConnect()
            
            const {billId} =  await request.json()

            if (!billId) {
                return NextResponse.json({
                    message: "Bill Id is required"
                } , {status: 404})
            }

            console.log("📥 Body received:", billId);
            const userId = context.userId
           
             const pendingBill = await UtilityBill.findById(billId)

            if (!pendingBill) {
                return NextResponse.json({
                    message: "Bill not found"
                } , {status: 404})
            }

    //           if (!pendingBill.paymentProof?.url) {
    //     return NextResponse.json(
    //       { message: "Cannot mark as paid without payment proof" },
    //       { status: 400 }
    //     );
    //   }
     
         if (pendingBill.status === "paid") {
             return NextResponse.json(
          { message: "Bill alreday Paid" },
          { status: 400 }
        );
         }

         // mark as paid
         pendingBill.markAsPaid()
         await pendingBill.save()
        return NextResponse.json({
         message: "Bill approved and marked as paid",
         pendingBill,
         userId
        } , {status: 201})


        } catch (error) {
            console.log("Error while marking paid" , error)
            return NextResponse.json({
                message: "Error while marking paid"
            } , {status: 500})
        }
    }
)
