import mongoose, { Document, Schema, Model } from "mongoose";

// Define utility types
export type UtilityType = "electricity" | "water" | "gas" | "internet" | "trash" | "other";
export type UtilityStatus = "pending" | "paid" | "overdue";
export type ResponsibleParty = "landlord" | "tenant";

// Billing period interface
export interface IBillingPeriod {
  start: Date;
  end: Date;
}

// Main Utility Bill document interface
export interface IUtilityBill extends Document {
  propertyId: mongoose.Schema.Types.ObjectId;
  landlordId: mongoose.Schema.Types.ObjectId;
  tenantId?: mongoose.Schema.Types.ObjectId;
  utilityType: UtilityType;
  amount: number;
  billingPeriod: IBillingPeriod;
  dueDate?: Date;
  paidDate?: Date;
  status: UtilityStatus;
   paymentProof?: {
    url: string;
    uploadedAt?: Date;
  };
  responsibleParty: ResponsibleParty;
  billDocument?: string;
  notes?: string;
 
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  isOverdue(): boolean;
  markAsPaid(paidDate?: Date): void;
  getDaysOverdue(): number;
  getBillingPeriodDuration(): number;
  isValidBillingPeriod(): boolean;
}

// Model interface for static methods
export interface IUtilityBillModel extends Model<IUtilityBill> {
  findOverdueBills(): Promise<IUtilityBill[]>;
  findPendingBills(): Promise<IUtilityBill[]>;
  findByProperty(propertyId: string): Promise<IUtilityBill[]>;
  findByTenant(tenantId: string): Promise<IUtilityBill[]>;
  findByLandlord(landlordId: string): Promise<IUtilityBill[]>;
  findByUtilityType(utilityType: UtilityType): Promise<IUtilityBill[]>;
  getMonthlyUtilityCost(propertyId: string, year: number, month: number): Promise<number>;
  getUtilityStats(propertyId: string): Promise<{
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    averageMonthly: number;
    byType: Record<UtilityType, number>;
  }>;
}

// Utility Bill Schema
const utilityBillSchema = new Schema<IUtilityBill>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "MicroProperty",
      required: [true, "Property ID is required"],
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "MicroestateUser",
      required: [true, "Landlord ID is required"],
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "MicroestateUser",
      validate: {
        validator: function(this: IUtilityBill, value: mongoose.Schema.Types.ObjectId) {
          // Tenant ID is required if tenant is responsible
          return this.responsibleParty !== "tenant" || !!value;
        },
        message: "Tenant ID is required when tenant is responsible for the bill",
      },
    },
    utilityType: {
      type: String,
      enum: {
        values: ["electricity", "water", "gas", "internet", "trash", "other"],
        message: "Utility type must be one of: electricity, water, gas, internet, trash, other",
      },
      required: [true, "Utility type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    billingPeriod: {
      start: {
        type: Date,
        required: [true, "Billing period start date is required"],
      },
      end: {
        type: Date,
        required: [true, "Billing period end date is required"],
        validate: {
          validator: function(this: IUtilityBill, value: Date) {
            return value > this.billingPeriod?.start;
          },
          message: "Billing period end date must be after start date",
        },
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function(this: IUtilityBill, value: Date) {
          return value >= this.billingPeriod.end;
        },
        message: "Due date must be after billing period end date",
      },
    },
    paidDate: {
      type: Date,
      validate: {
        validator: function(this: IUtilityBill, value: Date) {
          return !value || this.status === "paid";
        },
        message: "Paid date can only be set when status is paid",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "overdue"],
        message: "Status must be one of: pending, paid, overdue",
      },
      default: "pending",
    },
    responsibleParty: {
      type: String,
      enum: {
        values: ["landlord", "tenant"],
        message: "Responsible party must be either landlord or tenant",
      },
      required: [true, "Responsible party is required"],
    },
    billDocument: {
      type: String,
      validate: {
        validator: function(value: string) {
          return !value || /^https?:\/\/.+\.(pdf|jpg|jpeg|png|gif)$/i.test(value);
        },
        message: "Bill document must be a valid URL to a PDF or image file",
      },
    },
      paymentProof: {
    url: {
      type: String,
      validate: {
        validator: function (value: string) {
          return !value || /^https?:\/\/.+\.(pdf|jpg|jpeg|png|gif)$/i.test(value);
        },
        message: "Payment proof must be a valid URL to an image file",
      },
    },
    uploadedAt: Date,
  },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  
  {
    timestamps: true,
  }
);

// Instance Methods
// utilityBillSchema.methods.isOverdue = function(this: IUtilityBill): boolean {
//   const today = new Date();
//   return this.dueDate < today && this.status !== "paid";
// };

utilityBillSchema.methods.markAsPaid = function(this: IUtilityBill, paidDate?: Date): void {
  this.status = "paid";
  this.paidDate = paidDate || new Date();
};

// utilityBillSchema.methods.getDaysOverdue = function(this: IUtilityBill): number {
//   if (this.status === "paid") return 0;
  
//   const today = new Date();
//   const timeDiff = today.getTime() - this.dueDate.getTime();
//   return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
// };

// utilityBillSchema.methods.getBillingPeriodDuration = function(this: IUtilityBill): number {
//   const timeDiff = this.billingPeriod.end.getTime() - this.billingPeriod.start.getTime();
//   return Math.ceil(timeDiff / (1000 * 3600 * 24));
// };

// utilityBillSchema.methods.isValidBillingPeriod = function(this: IUtilityBill): boolean {
//   return this.billingPeriod.start < this.billingPeriod.end;
// };

// Static Methods
utilityBillSchema.statics.findOverdueBills = function(LandlordId): Promise<IUtilityBill[]> {
  return this.find({
    status: { $in: ["pending"] },
    dueDate: { $lt: new Date() },
    LandlordId
  }).populate("propertyId landlordId tenantId");
};

// utilityBillSchema.statics.findPendingBills = function(): Promise<IUtilityBill[]> {
//   return this.find({ status: "pending" }).populate("propertyId landlordId tenantId");
// };

// utilityBillSchema.statics.findByProperty = function(propertyId: string): Promise<IUtilityBill[]> {
//   return this.find({ propertyId })
//     .populate("landlordId tenantId")
//     .sort({ dueDate: -1 });
// };

// utilityBillSchema.statics.findByTenant = function(tenantId: string): Promise<IUtilityBill[]> {
//   return this.find({ tenantId, responsibleParty: "tenant" })
//     .populate("propertyId landlordId")
//     .sort({ dueDate: -1 });
// };

// utilityBillSchema.statics.findByLandlord = function(landlordId: string): Promise<IUtilityBill[]> {
//   return this.find({ landlordId })
//     .populate("propertyId tenantId")
//     .sort({ dueDate: -1 });
// };

// utilityBillSchema.statics.findByUtilityType = function(utilityType: UtilityType): Promise<IUtilityBill[]> {
//   return this.find({ utilityType })
//     .populate("propertyId landlordId tenantId")
//     .sort({ dueDate: -1 });
// };

//  for history of bill by a particular property Id 
utilityBillSchema.statics.getMonthlyUtilityCost = function(
  propertyId: string,
  year: number,
  month: number
): Promise<number> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return this.aggregate([
    {
      $match: {
        propertyId: new mongoose.Types.ObjectId(propertyId),
        status: "paid",
        "billingPeriod.start": { $gte: startDate },
        "billingPeriod.end": { $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalCost: { $sum: "$amount" }
      }
    }
  ]).then(result => result[0]?.totalCost || 0);
};




// utilityBillSchema.statics.getUtilityStats = function(propertyId: string) {
//   return this.aggregate([
//     {
//       $match: {
//         propertyId: new mongoose.Types.ObjectId(propertyId)
//       }
//     },
//     {
//       $group: {
//         _id: "$status",
//         total: { $sum: "$amount" },
//         count: { $sum: 1 },
//         types: {
//           $push: {
//             type: "$utilityType",
//             amount: "$amount"
//           }
//         }
//       }
//     }
//   ]).then(results => {
//     const stats = {
//       totalPaid: 0,
//       totalPending: 0,
//       totalOverdue: 0,
//       averageMonthly: 0,
//       byType: {} as Record<UtilityType, number>
//     };
    
//     results.forEach(result => {
//       switch (result._id) {
//         case "paid":
//           stats.totalPaid = result.total;
//           break;
//         case "pending":
//           stats.totalPending = result.total;
//           break;
//         case "overdue":
//           stats.totalOverdue = result.total;
//           break;
//       }
      
//       // Calculate by type
//       result.types.forEach((typeData: any) => {
//         const utilityType = typeData.type as UtilityType;
//         if (!stats.byType[utilityType]) {
//           stats.byType[utilityType] = 0;
//         }
//         stats.byType[utilityType] += typeData.amount;
//       });
//     });
    
//     stats.averageMonthly = (stats.totalPaid + stats.totalPending + stats.totalOverdue) / 12;
//     return stats;
//   });
// };

// Pre-save middleware for status updates
utilityBillSchema.pre<IUtilityBill>("save", function(next) {
  const now = new Date();
  
  // Auto-update status to overdue if past due date and not paid
  // if (this.dueDate < now && this.status === "pending") {
  //   this.status = "overdue";
  // }
  
  // Set paid date if marking as paid
  if (this.status === "paid" && !this.paidDate) {
    this.paidDate = now;
  }
  
  next();
});

// Indexes for performance
utilityBillSchema.index({ propertyId: 1, status: 1 });
utilityBillSchema.index({ landlordId: 1, status: 1 });
utilityBillSchema.index({ tenantId: 1, responsibleParty: 1 });
utilityBillSchema.index({ dueDate: 1, status: 1 });
utilityBillSchema.index({ utilityType: 1, status: 1 });
utilityBillSchema.index({ "billingPeriod.start": 1, "billingPeriod.end": 1 });

// Create the model
const UtilityBill: IUtilityBillModel = (mongoose.models.UtilityBill as IUtilityBillModel) || mongoose.model<IUtilityBill, IUtilityBillModel>("UtilityBill", utilityBillSchema);

export default UtilityBill;

// Additional TypeScript types for API usage
export interface CreateUtilityBillInput {
  propertyId: string;
  landlordId: string;
  tenantId?: string;
  utilityType: UtilityType;
  amount: number;
  billingPeriod?: IBillingPeriod;
  dueDate: Date;
  responsibleParty: ResponsibleParty;
  billDocument?: string;
  notes?: string;
}

export interface UpdateUtilityBillInput {
  amount?: number;
  billingPeriod?: IBillingPeriod;
  dueDate?: Date;
  status?: UtilityStatus;
  responsibleParty?: ResponsibleParty;
  billDocument?: string;
  notes?: string;
}

export interface UtilityBillResponse {
  _id: string;
  propertyId:{
    address: {
      city: string,
      country: string,
    }
    title: string
  }
  landlordId: string;
  tenantId?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  utilityType: UtilityType;
  amount: number;
  dueDateFormatted: string,
  billingPeriod: IBillingPeriod;
  dueDate: Date;
  paidDate?: Date;
  status: UtilityStatus;
  responsibleParty: ResponsibleParty;
  billDocument?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isOverdue: boolean;
  daysOverdue: number;
  billingPeriodDuration: number;
}

export interface UtilityStats {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  averageMonthly: number;
  byType: Record<UtilityType, number>;
}

// // Utility functions
// export const calculateUtilityAverage = (
//   bills: IUtilityBill[],
//   utilityType?: UtilityType
// ): number => {
//   const filteredBills = utilityType 
//     ? bills.filter(bill => bill.utilityType === utilityType)
//     : bills;
  
//   if (filteredBills.length === 0) return 0;
  
//   const total = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
//   return total / filteredBills.length;
// };


// export const generateUtilityReport = (bills: IUtilityBill[]) => {
//   const report = {
//     totalBills: bills.length,
//     totalAmount: 0,
//     paidAmount: 0,
//     pendingAmount: 0,
//     overdueAmount: 0,
//     byType: {} as Record<UtilityType, { count: number; total: number; average: number }>,
//     byResponsibleParty: {
//       landlord: { count: 0, total: 0 },
//       tenant: { count: 0, total: 0 }
//     }
//   };
  
//   bills.forEach(bill => {
//     report.totalAmount += bill.amount;
    
//     // Status breakdown
//     switch (bill.status) {
//       case "paid":
//         report.paidAmount += bill.amount;
//         break;
//       case "pending":
//         report.pendingAmount += bill.amount;
//         break;
//       case "overdue":
//         report.overdueAmount += bill.amount;
//         break;
//     }
    
//     // By type
//     if (!report.byType[bill.utilityType]) {
//       report.byType[bill.utilityType] = { count: 0, total: 0, average: 0 };
//     }
//     report.byType[bill.utilityType].count++;
//     report.byType[bill.utilityType].total += bill.amount;
    
//     // By responsible party
//     report.byResponsibleParty[bill.responsibleParty].count++;
//     report.byResponsibleParty[bill.responsibleParty].total += bill.amount;
//   });
  
//   // Calculate averages
//   Object.keys(report.byType).forEach(type => {
//     const typeData = report.byType[type as UtilityType];
//     typeData.average = typeData.total / typeData.count;
//   });
  
//   return report;
//};