# Commercial Equity Ownership Module

A comprehensive frontend solution for fractional commercial real estate investment, built with Next.js, TypeScript, and Tailwind CSS.

## 🏢 Features

### Property Listings Page (`/commercial`)
- **Grid View**: Display commercial properties with key investment metrics
- **Advanced Filtering**: Filter by property type, location, ROI, and rental yield
- **Search Functionality**: Search properties by name, location, or description
- **Sorting Options**: Sort by ROI, rental yield, minimum investment, or newest listings
- **Property Cards**: Show ROI%, rental yield, min investment, available shares, and occupancy

### Property Detail Page (`/commercial/[id]`)
- **Comprehensive Property Info**: Location, size, asset type, developer details, current occupancy
- **Image Gallery**: Multiple property images with interactive navigation
- **Investment Calculator**: Real-time calculator showing:
  - Expected rental returns based on investment amount
  - Ownership percentage calculation
  - Projected appreciation over 1, 3, and 5 years
  - Total ROI projections
- **Buy Shares Form**: 
  - Input investment amount or number of shares
  - Real-time validation and calculations
  - KYC compliance notices
  - Terms & conditions agreement
- **Tabbed Content**: Overview, Details, Documents, SPV Information
- **Document Downloads**: Property documents and legal papers

### Investor Dashboard (`/dashboard`)
- **Portfolio Overview**: Total invested, current value, monthly income, overall ROI
- **Performance Tracking**: Capital appreciation, rental income, net profit
- **Property Cards**: Individual investment performance with:
  - Ownership percentage
  - Monthly rental income
  - Capital appreciation graphs
  - Download ownership documents
- **Transaction History**: Complete investment timeline
- **Document Center**: Access to ownership certificates and investment statements

## 🛠️ Technical Architecture

### Components Structure
```
app/commercial/
├── page.tsx                    # Main listings page
├── [id]/page.tsx              # Property detail page
└── components/
    ├── InvestmentCalculator.tsx
    ├── BuySharesModal.tsx
    └── PropertyCardCommercial.tsx

app/dashboard/
└── page.tsx                   # Investor dashboard

app/data/
└── commercialProperties.ts    # Mock data and types
```

### Key Technologies
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **Framer Motion** for animations
- **React Icons** for iconography
- **Sonner** for toast notifications

### Design System Integration
- Uses existing luxury-themed design tokens
- Orange (#FF6600) primary color scheme
- Dark theme with gradient backgrounds
- Consistent card components and hover effects
- Responsive design for all screen sizes

## 📊 Data Models

### CommercialProperty Interface
```typescript
interface CommercialProperty {
  _id: string;
  title: string;
  description: string;
  location: string;
  address: AddressInfo;
  images: string[];
  propertyType: 'Office' | 'Retail' | 'Warehouse' | 'Mixed Use' | 'Industrial';
  totalArea: number;
  builtYear: number;
  developer: DeveloperInfo;
  
  // Investment Details
  totalPropertyValue: number;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  minInvestment: number;
  
  // Returns
  currentROI: number;
  rentalYield: number;
  appreciationRate: number;
  currentOccupancy: number;
  monthlyRental: number;
  
  // SPV Details
  spvId: string;
  spvName: string;
  
  status: 'active' | 'sold_out' | 'coming_soon';
  featured: boolean;
}
```

### UserInvestment Interface
```typescript
interface UserInvestment {
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
  capitalAppreciation: number;
  totalReturns: number;
  status: 'active' | 'sold';
}
```

## 💰 Investment Logic

### Share Calculation
- Each property is divided into tradeable shares
- Share price = Total Property Value / Total Shares
- Minimum investment enforced per property
- Ownership % = (Shares Owned / Total Shares) × 100

### Returns Calculation
- **Monthly Rental** = (Monthly Property Rental × Ownership %) / 100
- **Capital Appreciation** = Investment × (1 + Appreciation Rate)^Years
- **Total Returns** = Rental Income + Capital Appreciation

### ROI Projections
- 1 Year ROI = (Annual Rental + Year 1 Appreciation) / Investment × 100
- Multi-year projections with compound appreciation
- Risk disclaimers and market condition warnings

## 🔒 Security & Compliance

### Authentication Integration
- Uses existing sessionStorage auth system
- Protected routes for investment actions
- KYC verification requirements
- Terms & conditions enforcement

### SPV Structure
- Each property mapped to Special Purpose Vehicle (SPV)
- Legal structure for fractional ownership
- Document management for ownership certificates
- Regulatory compliance notices

## 🎨 UI/UX Features

### Interactive Elements
- **Hover Effects**: Property cards with shadow animations
- **Loading States**: Skeleton loading and spinners
- **Form Validation**: Real-time input validation with error messages
- **Modal Workflows**: Step-by-step investment process
- **Responsive Design**: Mobile-first approach

### Visual Indicators
- **Status Badges**: Featured, Sold Out, Coming Soon
- **Progress Bars**: Share availability visualization
- **Color Coding**: 
  - Green: Positive returns, high availability
  - Orange: Primary actions, warnings
  - Red: Sold out, errors
  - Blue: Information, rental income

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Semantic HTML structure

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Existing 100Gaj project setup
- Tailwind CSS configured
- Shadcn/UI components installed

### Installation
The module is already integrated into the existing project structure. Key routes:

1. **Commercial Listings**: Navigate to `/commercial`
2. **Property Details**: Click any property card
3. **Investment Dashboard**: Go to `/dashboard` (requires login)

### Mock Data
Currently uses mock data in `app/data/commercialProperties.ts`:
- 5 sample commercial properties
- 2 sample user investments
- Realistic financial projections

### Navigation
Updated navbar includes:
- "Commercial" link in main navigation
- "Dashboard" link for authenticated users
- Mobile-responsive menu updates

## 📱 Responsive Behavior

### Desktop (1024px+)
- 3-column property grid
- Side-by-side calculator and property details
- Full tabbed interface
- Expanded property information

### Tablet (768px - 1023px)
- 2-column property grid
- Stacked calculator below property details
- Condensed tabs
- Optimized touch targets

### Mobile (< 768px)
- Single column layout
- Collapsible filters
- Full-width modals
- Touch-optimized interactions

## 🔧 Customization

### Branding
- Colors defined in `globals.css` CSS variables
- Logo and company name in navbar
- Consistent with existing 100Gaj branding

### Features
- Easy to add new property types
- Configurable investment calculations
- Extensible document types
- Customizable status workflows

### Styling
- Uses existing luxury-card classes
- Gradient backgrounds and effects
- Consistent button and form styling
- Shadcn/UI theme integration

## 🔮 Future Enhancements

### Phase 2 Features
- **Secondary Market**: Peer-to-peer share trading
- **Advanced Analytics**: Detailed performance charts
- **Automated Payments**: Integration with payment gateways
- **Document Signing**: Digital signature workflows
- **Tax Reporting**: Generate tax documents
- **Mobile App**: React Native companion app

### Backend Integration
- Replace mock data with real API calls
- User authentication system
- Payment processing
- Document management system
- Notification system
- Audit trails

### Advanced Features
- **Portfolio Optimization**: AI-driven investment suggestions
- **Market Analysis**: Comparative market analysis tools
- **Rental Forecasting**: Predictive rental income models
- **Exit Planning**: Share liquidation strategies

## 📞 Support

For technical questions or feature requests, refer to the main project documentation or contact the development team.

---

**Built with ❤️ for modern real estate investing**