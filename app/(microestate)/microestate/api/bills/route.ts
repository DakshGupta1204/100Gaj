// get all bills and Create Bills 

import { NextResponse , NextRequest } from "next/server";
import UtilityBill from "@/app/(microestate)/models/Utility";
import dbConnect from "@/app/(microestate)/lib/db";
import MicroestateUser from "@/app/(microestate)/models/user";
import { requireLandlord } from "@/app/(microestate)/middleware/auth";
import Lease from "@/app/(microestate)/models/Lease";
import MicroProperty from "@/app/(microestate)/models/Property"; // Add this import


// get all billsexport 
 export const GET = requireLandlord(
  async (_request: NextRequest, context: { userId: string; userRole: string; userEmail: string }) => {
    try {
      await dbConnect();

      const UserID = context.userId // landlord Id 

      if (!UserID) {
        return NextResponse.json(
          { message: "User id required!" },
          { status: 404}
        );
      }

      const landloardUser = await MicroestateUser.findById(UserID)
      if (!landloardUser) {
         return NextResponse.json(
          { message: "No user Found" },
          { status: 404}
        );
      }

    const bills = await UtilityBill.find({ landlordId: context.userId })
     .populate({
    path: "propertyId",
    model: MicroProperty, 
    select: "title address"
  })
  .populate({
    path: "tenantId",
    model: MicroestateUser,
    select: "firstName lastName"
  });
  // .populate("tenantId", "Firstname");

  
      if (!bills || bills.length === 0) {
        return NextResponse.json(
          { message: "No Bills Found" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          message: "Bills Found",
          bills,
        },
        { status: 200 }
      );

    } catch (error) {
      console.log("Error while Getting all the bills", error);
      return NextResponse.json(
        { message: "Error occurred while fetching bills" },
        { status: 500 }
      );
    }
  }
)


// create bill

// check if the user is login as  landlord or not only allow if the user is landlord 
// find the user(landloard) in  database 
// find the property which the user(landloard) has owned 
// find tentant which has assigned to it if not return  error respone 
// create a bill for bill type  ,  amount , billingPeriod , end , dueDate , status  from landloard from request.json
// add that bill in Utility for that tentant and return response 


// requiredLandlord 
// property id from lease model
// take propertyId from frontend (params/url)
// add bill


export const POST = requireLandlord(
  async (request: NextRequest, context: { userId: string; userRole: string; userEmail: string }) => {
    try {
      await dbConnect();

      const {
        utilityType,
        amount,
        billingPeriod,
        dueDate,
        responsibleParty,
        billDocument,
        notes,
      } = await request.json();

      if (!utilityType || !amount  || !responsibleParty) {
        return NextResponse.json(
          { message: "ALL fields are required!" },
          { status: 400 }
        );
      }

      const UserId = context.userId;

      const FoundUser = await MicroestateUser.findById(UserId);
      if (!FoundUser) {
        return NextResponse.json(
          { message: "User does not exist in our database" },
          { status: 400 }
        );
      }

      // Find property owned by landlord
      const property = await Lease.findOne({ landlordId: UserId });
      if (!property) {
        return NextResponse.json(
          { message: "You don't have any property" },
          { status: 400 }
        );
      }
    
      // Find active tenant assigned to the property
      const tenant = await Lease.findOne({
        propertyId: property.propertyId,
      });


      if (responsibleParty === "tenant" && !tenant) {
        return NextResponse.json(
          { message: "No active tenant assigned to this property" },
          { status: 400 }
        );
      }

      if (!tenant) {
        return NextResponse.json(
          { message: "No tenant assigned to your property" },
          { status: 404 }
        );
      }

      const newBill = await UtilityBill.create({
        propertyId: property.propertyId,
        landlordId: UserId,
        tenantId: tenant.tenantId,
        utilityType,
        amount,
        billingPeriod: {
          start: billingPeriod.start,
          end:  billingPeriod.end,
        },
        dueDate,
        status: "pending",
        responsibleParty,
        billDocument,
        notes,
      });

      await newBill.save();

      return NextResponse.json(
        {
          message: "Bill Created Successfully",
          newBill,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error while Creating Bill", error);
      return NextResponse.json(
        { message: "Error while creating bill" },
        { status: 500 }
      );
    }
  }
);
