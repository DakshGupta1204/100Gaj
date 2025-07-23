import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Property from '@/app/models/Property';
import Inquiry from '@/app/models/Inquiry';
import { withAuthAndSubscription } from '@/app/lib/subscription-middleware';
import { UserType, PlanType } from '@/app/models/Subscription';

/**
 * GET /api/agents/analytics - Get performance analytics for agents
 * This endpoint requires a premium subscription for agents
 */
async function getAgentAnalytics(request: NextRequest, userId: string) {
  try {
    await connectDB();
    
    // Get date ranges from query params
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'month';
    
    // Calculate start date based on period
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1); // Default to month
    }
    
    // Find properties assigned to the agent
    const properties = await Property.find({
      agent: userId,
      createdAt: { $gte: startDate }
    });
    
    // Get property IDs
    const propertyIds = properties.map(property => property._id);
    
    // Find inquiries for these properties
    const inquiries = await Inquiry.find({
      property: { $in: propertyIds },
      createdAt: { $gte: startDate }
    });
    
    // Calculate analytics
    const analytics = {
      period,
      propertiesAssigned: properties.length,
      propertiesByStatus: {
        active: properties.filter(p => p.status === 'active').length,
        sold: properties.filter(p => p.status === 'sold').length,
        pending: properties.filter(p => p.status === 'pending').length,
        inactive: properties.filter(p => p.status === 'inactive').length
      },
      inquiriesReceived: inquiries.length,
      responseRate: calculateResponseRate(inquiries),
      averageResponseTime: calculateAverageResponseTime(inquiries),
      leadConversionRate: calculateLeadConversionRate(properties, inquiries),
      propertyTypeDistribution: calculatePropertyTypeDistribution(properties),
      userProfileViews: Math.floor(Math.random() * 200 + 50), // Simulated data
      topPerformingListings: getTopPerformingListings(properties, inquiries),
      inquiriesOverTime: generateTimeSeriesData(inquiries, startDate, now, period),
      // Premium analytics features
      marketShare: calculateMarketShare(),
      competitorComparison: generateCompetitorComparison(),
      potentialEarnings: calculatePotentialEarnings(properties),
      clientDemographics: generateClientDemographics()
    };
    
    return NextResponse.json({
      success: true,
      analytics
    });
  } catch (_error) {

    return NextResponse.json(
      { error: 'An error occurred while generating agent analytics' },
      { status: 500 }
    );
  }
}

// Helper functions for analytics calculations

function calculateResponseRate(inquiries: any[]) {
  if (inquiries.length === 0) return 0;
  const respondedInquiries = inquiries.filter(inquiry => inquiry.status !== 'pending');
  return Math.round((respondedInquiries.length / inquiries.length) * 100);
}

function calculateAverageResponseTime(inquiries: any[]) {
  const respondedInquiries = inquiries.filter(inquiry => 
    inquiry.respondedAt && inquiry.createdAt);
  
  if (respondedInquiries.length === 0) return null;
  
  const totalResponseTime = respondedInquiries.reduce((total, inquiry) => {
    const responseTime = new Date(inquiry.respondedAt).getTime() - new Date(inquiry.createdAt).getTime();
    return total + responseTime;
  }, 0);
  
  // Return average response time in hours
  return Math.round((totalResponseTime / respondedInquiries.length) / (1000 * 60 * 60) * 10) / 10;
}

function calculateLeadConversionRate(properties: any[], inquiries: any[]) {
  const soldProperties = properties.filter(p => p.status === 'sold').length;
  return inquiries.length > 0 ? Math.round((soldProperties / inquiries.length) * 100) : 0;
}

function calculatePropertyTypeDistribution(properties: any[]) {
  const distribution: Record<string, number> = {};
  
  properties.forEach(property => {
    const type = property.propertyType;
    distribution[type] = (distribution[type] || 0) + 1;
  });
  
  return distribution;
}

function getTopPerformingListings(properties: any[], inquiries: any[]) {
  // Count inquiries per property
  const inquiryCountByProperty: Record<string, number> = {};
  
  inquiries.forEach(inquiry => {
    const propertyId = inquiry.property.toString();
    inquiryCountByProperty[propertyId] = (inquiryCountByProperty[propertyId] || 0) + 1;
  });
  
  // Sort properties by inquiry count
  const sortedProperties = [...properties].sort((a, b) => {
    const countA = inquiryCountByProperty[a._id.toString()] || 0;
    const countB = inquiryCountByProperty[b._id.toString()] || 0;
    return countB - countA;
  });
  
  // Return top 5 properties
  return sortedProperties.slice(0, 5).map(property => ({
    id: property._id,
    title: property.title,
    price: property.price,
    inquiryCount: inquiryCountByProperty[property._id.toString()] || 0,
    status: property.status,
    daysListed: Math.floor((new Date().getTime() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  }));
}

function generateTimeSeriesData(inquiries: any[], startDate: Date, endDate: Date, period: string) {
  let interval: 'day' | 'week' | 'month';
  
  // Determine appropriate interval based on period
  if (period === 'week') {
    interval = 'day';
  } else if (period === 'month') {
    interval = 'day';
  } else if (period === 'quarter') {
    interval = 'week';
  } else {
    interval = 'month';
  }
  
  // Generate time series data
  const timeSeriesData: Record<string, number> = {};
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    let key;
    
    if (interval === 'day') {
      key = currentDate.toISOString().split('T')[0];
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (interval === 'week') {
      const weekNumber = Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7);
      key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-W${weekNumber}`;
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    timeSeriesData[key] = 0;
  }
  
  // Count inquiries for each time period
  inquiries.forEach(inquiry => {
    const inquiryDate = new Date(inquiry.createdAt);
    let key;
    
    if (interval === 'day') {
      key = inquiryDate.toISOString().split('T')[0];
    } else if (interval === 'week') {
      const weekNumber = Math.ceil((inquiryDate.getDate() + new Date(inquiryDate.getFullYear(), inquiryDate.getMonth(), 1).getDay()) / 7);
      key = `${inquiryDate.getFullYear()}-${inquiryDate.getMonth() + 1}-W${weekNumber}`;
    } else {
      key = `${inquiryDate.getFullYear()}-${inquiryDate.getMonth() + 1}`;
    }
    
    if (timeSeriesData[key] !== undefined) {
      timeSeriesData[key]++;
    }
  });
  
  // Convert to array format for easier consumption by charts
  return Object.entries(timeSeriesData).map(([date, count]) => ({ date, count }));
}

// Premium analytics features - simulated data
function calculateMarketShare() {
  return {
    agent: (Math.random() * 5 + 1).toFixed(2) + '%',
    topCompetitor: (Math.random() * 7 + 3).toFixed(2) + '%',
    agencyTotal: (Math.random() * 15 + 5).toFixed(2) + '%'
  };
}

function generateCompetitorComparison() {
  return {
    averageTimeToSell: {
      agent: Math.floor(Math.random() * 20 + 30),
      marketAverage: Math.floor(Math.random() * 20 + 40)
    },
    averagePriceDeviation: {
      agent: (Math.random() * 5 - 2.5).toFixed(2) + '%',
      marketAverage: (Math.random() * 2 - 4).toFixed(2) + '%'
    },
    customerSatisfaction: {
      agent: (Math.random() * 1 + 4).toFixed(1) + '/5',
      marketAverage: (Math.random() * 0.5 + 3.5).toFixed(1) + '/5'
    }
  };
}

function calculatePotentialEarnings(properties: any[]) {
  // Calculate potential commission based on property values
  const totalPropertyValue = properties.reduce((total, property) => total + property.price, 0);
  const commissionRate = 0.025; // 2.5% standard commission
  
  return {
    totalPropertyValue: totalPropertyValue,
    potentialCommission: Math.round(totalPropertyValue * commissionRate),
    projectedAnnualEarnings: Math.round(totalPropertyValue * commissionRate * 4), // Projecting quarterly data to annual
    commissionByPropertyType: {
      residential: Math.round(totalPropertyValue * 0.6 * commissionRate), // Assuming 60% residential
      commercial: Math.round(totalPropertyValue * 0.3 * commissionRate), // Assuming 30% commercial
      land: Math.round(totalPropertyValue * 0.1 * commissionRate) // Assuming 10% land
    }
  };
}

function generateClientDemographics() {
  // In a real application, this would be calculated from actual user data
  return {
    ageGroups: {
      "18-24": Math.floor(Math.random() * 10 + 5),
      "25-34": Math.floor(Math.random() * 30 + 20),
      "35-44": Math.floor(Math.random() * 30 + 20),
      "45-54": Math.floor(Math.random() * 20 + 10),
      "55+": Math.floor(Math.random() * 15 + 5)
    },
    buyerTypes: {
      firstTime: Math.floor(Math.random() * 30 + 20),
      investor: Math.floor(Math.random() * 20 + 10),
      upgrading: Math.floor(Math.random() * 25 + 15),
      downgrading: Math.floor(Math.random() * 15 + 5),
      vacation: Math.floor(Math.random() * 10 + 5)
    },
    preferredContactMethod: {
      email: Math.floor(Math.random() * 40 + 30),
      phone: Math.floor(Math.random() * 30 + 20),
      app: Math.floor(Math.random() * 20 + 10)
    }
  };
}

// Export the route handler with authentication and subscription check
// Requires a premium subscription for dealers and agents
export const GET = withAuthAndSubscription(
  getAgentAnalytics,
  'use_ai', // Using AI tools category for analytics
  [UserType.DEALER],
  PlanType.PREMIUM // Requiring PREMIUM plan for advanced analytics
); 