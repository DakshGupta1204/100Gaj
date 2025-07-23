export interface CommercialProperty {
  _id: string;
  title: string;
  description: string;
  location: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: [number, number];
  };
  images: string[];

  // Property Details
  propertyType: "Office" | "Retail" | "Warehouse" | "Mixed Use" | "Industrial";
  totalArea: number; // in sqft
  builtYear: number;

  // Developer Info
  developer: {
    name: string;
    rating: number;
    projectsCompleted: number;
  };

  // Investment Details
  totalPropertyValue: number; // Total value of the property
  totalShares: number; // Total shares available
  availableShares: number; // Remaining shares for purchase
  pricePerShare: number;
  minInvestment: number;

  // Returns
  currentROI: number; // Annual ROI percentage
  rentalYield: number; // Annual rental yield percentage
  appreciationRate: number; // Expected annual appreciation

  // Occupancy & Revenue
  currentOccupancy: number; // Percentage
  monthlyRental: number; // Total monthly rental income

  // SPV Details
  spvId: string;
  spvName: string;

  // Status
  status: "active" | "sold_out" | "coming_soon";
  featured: boolean;

  // Additional Info
  amenities: string[];
  nearbyLandmarks: string[];

  // Documents
  documents: {
    name: string;
    url: string;
    type: "legal" | "financial" | "technical";
  }[];

  createdAt: string;
  updatedAt: string;
}

export interface UserInvestment {
  _id: string;
  userId: string;
  propertyId: string;
  property: CommercialProperty;
  sharesOwned: number;
  totalInvested: number;
  purchaseDate: string;
  currentValue: number;
  totalRentalReceived: number;
  monthlyRental: number;
  ownershipPercentage: number;

  // Returns tracking
  capitalAppreciation: number;
  totalReturns: number;

  status: "active" | "sold";
}
