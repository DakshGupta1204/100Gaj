import mongoose, { Schema, Document } from "mongoose";

export interface ICommercialProperty extends Document {
  propertyType: string;
  listingCategory: string;
  projectName: string;
  fullAddress: string;
  pinCode: string;
  city: string;
  locality: string;
  googleMapsPin?: string;
  possessionStatus: string;
  builtUpArea: number;
  totalValuation: number;
  minimumInvestmentTicket: string;
  customTicketAmount?: number;
  targetRaiseAmount: number;
  ownershipSplit: string;
  totalShares?: number;
  sharePercentage?: number;
  rentalYield: number;
  annualROIProjection: number;
  minimumHoldingPeriod: string;
  exitOptions: string[];
  documentsUploaded: boolean;
  uploadedDocuments: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  }[];
  images: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }[];
  virtualTourLink?: string;
  requestVirtualTour: boolean;
  brochure?: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
  };
  highlights: string[];
  customHighlights?: string;
  tenantName?: string;
  ownerDetails: {
    name: string;
    phone: string;
    email: string;
    companyName?: string;
  };
  termsAccepted: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: "pending" | "under_review" | "approved" | "rejected" | "published";
  userId: mongoose.Types.ObjectId;
}

const CommercialPropertySchema = new Schema<ICommercialProperty>(
  {
    propertyType: { type: String, required: true },
    listingCategory: { type: String, default: "Fractional Ownership" },

    projectName: { type: String, required: true },
    fullAddress: { type: String, required: true },
    pinCode: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, required: true },
    googleMapsPin: { type: String },
    possessionStatus: { type: String, required: true },
    builtUpArea: { type: Number, required: true },
    totalValuation: { type: Number, required: true },
    minimumInvestmentTicket: { type: String, required: true },
    customTicketAmount: { type: Number },

    targetRaiseAmount: { type: Number, required: true },
    ownershipSplit: { type: String, required: true },
    totalShares: { type: Number },
    sharePercentage: { type: Number },
    rentalYield: { type: Number, required: true },
    annualROIProjection: { type: Number, required: true },
    minimumHoldingPeriod: { type: String, required: true },
    exitOptions: [{ type: String, required: true }],

    documentsUploaded: { type: Boolean, required: true },
    uploadedDocuments: [
      {
        fileName: String,
        fileUrl: String,
        fileSize: Number,
        fileType: String,
      },
    ],

    images: [
      {
        fileName: String,
        fileUrl: String,
        fileSize: Number,
      },
    ],

    virtualTourLink: { type: String },
    requestVirtualTour: { type: Boolean, required: true },
    brochure: {
      fileName: String,
      fileUrl: String,
      fileSize: Number,
    },

    highlights: [String],
    customHighlights: String,
    tenantName: String,

    ownerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      companyName: { type: String },
    },

    termsAccepted: {
      type: Boolean,
      required: true,
      validate: {
        validator: (v: boolean) => v === true,
        message: "Terms must be accepted",
      },
    },

    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "published"],
      default: "pending",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "commercialProperties",
  }
);

export const CommercialProperty =
  mongoose.models.CommercialProperty ||
  mongoose.model<ICommercialProperty>(
    "CommercialProperty",
    CommercialPropertySchema
  );
