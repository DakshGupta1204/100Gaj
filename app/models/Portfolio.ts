import mongoose, { Schema, model, Document } from "mongoose";

export interface IHolding {
    commercialPropertyId: mongoose.Types.ObjectId;
    shares: number;
    avgPurchasePrice: number;
    totalInvested: number;
    currentValue: number;
    unrealizedGainLoss: number;
    realizedGainLoss: number;
    dividendsReceived: number;
    firstPurchaseDate: Date;
    lastPurchaseDate: Date;
    notes?: string;
  }

export interface IPortfolioSummary {
    totalInvested: number;
    currentValue: number;
    totalGainLoss: number;
    totalDividends: number;
    totalProperties: number;
    totalShares: number;
    avgReturn: number;
  }
  
  export interface IMonthlyReturn {
    month: Date;
    return: number;
    percentage: number;
  }
  
  export interface IYearlyReturn {
    year: number;
    return: number;
    percentage: number;
  }
  
  export interface IPerformance {
    monthlyReturns: IMonthlyReturn[];
    yearlyReturns: IYearlyReturn[];
    lastUpdated: Date;
  }

export interface IPortfolio extends Document {
	userId: mongoose.Types.ObjectId;
	holdings: IHolding[];
	summary: IPortfolioSummary;
	performance: IPerformance;
	createdAt: Date;
	updatedAt: Date;
	totalReturnPercentage: number;
}
  
// Portfolio Schema
const portfolioSchema = new Schema<IPortfolio>(
	{
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
	},
	{
		timestamps: true,
	}
);

export default model<IPortfolio>("Portfolio", portfolioSchema);