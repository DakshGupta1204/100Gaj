import { Schema, model } from "mongoose";
// Portfolio Schema
const portfolioSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    holdings: [
        {
            commercialPropertyId: {
                type: Schema.Types.ObjectId,
                ref: "commercialProperty",
                required: true,
            },
            shares: {
                type: Number,
                required: true,
            },
            avgPurchasePrice: {
                type: Number,
                required: true,
            },
            totalInvested: {
                type: Number,
                required: true,
            },
            currentValue: {
                type: Number,
                required: true,
            },
            unrealizedGainLoss: {
                type: Number,
                default: 0,
            },
            realizedGainLoss: {
                type: Number,
                default: 0,
            },
            dividendsReceived: {
                type: Number,
                default: 0,
            },
            firstPurchaseDate: Date,
            lastPurchaseDate: Date,
            notes: String,
        },
    ],
    summary: {
        totalInvested: {
            type: Number,
            default: 0,
        },
        currentValue: {
            type: Number,
            default: 0,
        },
        totalGainLoss: {
            type: Number,
            default: 0,
        },
        totalDividends: {
            type: Number,
            default: 0,
        },
        totalProperties: {
            type: Number,
            default: 0,
        },
        totalShares: {
            type: Number,
            default: 0,
        },
        avgReturn: {
            type: Number,
            default: 0,
        },
    },
    performance: {
        monthlyReturns: [
            {
                month: Date,
                return: Number,
                percentage: Number,
            },
        ],
        yearlyReturns: [
            {
                year: Number,
                return: Number,
                percentage: Number,
            },
        ],
        lastUpdated: Date,
    },
}, {
    timestamps: true,
});
export default model("Portfolio", portfolioSchema);
