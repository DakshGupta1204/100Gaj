// This script seeds the database with initial builder data

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Builder schema (simplified version of the one in the app)
const BuilderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  logo: { type: String, required: true },
  projects: { type: Number, required: true },
  description: { type: String, required: true },
  established: { type: String, required: true },
  headquarters: { type: String, required: true },
  specialization: { type: String, required: true },
  rating: { type: Number, required: true },
  completed: { type: Number, required: true },
  ongoing: { type: Number, required: true },
  about: { type: String },
  projects_list: [
    {
      name: { type: String, required: true },
      location: { type: String, required: true },
      status: { type: String, enum: ['Completed', 'Ongoing'], required: true },
      type: { type: String, required: true }
    }
  ],
  reviews: [
    {
      user: { type: String, required: true },
      rating: { type: Number, required: true, min: 0, max: 5 },
      date: { type: String, required: true },
      text: { type: String, required: true }
    }
  ],
  contact: {
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    address: { type: String }
  }
}, { 
  timestamps: true 
});

// Sample data
const buildersData = [
  {
    title: "DLF Limited",
    image: "/image3.webp",
    logo: "/dwarka.jpeg",
    projects: 48,
    description: "Leading real estate developer known for premium residential and commercial properties across India.",
    established: "1946",
    headquarters: "New Delhi",
    specialization: "Luxury Residential, Commercial, Townships",
    rating: 4.5,
    completed: 42,
    ongoing: 6,
    about: "DLF Limited is India's largest publicly listed real estate company with over seven decades of track record of developing sustainable communities. DLF has developed some of the most prestigious residential colonies and commercial complexes in Delhi and other parts of India. The company's primary business is development of residential, commercial, and retail properties.",
    projects_list: [
      { name: "DLF Camellias", location: "Gurgaon", status: "Completed", type: "Ultra Luxury" },
      { name: "DLF Magnolias", location: "Gurgaon", status: "Completed", type: "Ultra Luxury" },
      { name: "DLF The Crest", location: "Gurgaon", status: "Completed", type: "Luxury" },
      { name: "DLF The Ultima", location: "Gurgaon", status: "Ongoing", type: "Premium" }
    ],
    reviews: [
      { user: "Rahul Singh", rating: 4.8, date: "2023-05-10", text: "Extremely satisfied with the quality of construction and amenities provided by DLF. Their customer service is exceptional." },
      { user: "Priya Sharma", rating: 4.5, date: "2023-04-15", text: "DLF has maintained their reputation for quality. My apartment in DLF Camellias has excellent finishes and the community is well maintained." },
      { user: "Amit Kumar", rating: 4.2, date: "2023-03-22", text: "Good build quality but there were some delays in the handover process. Otherwise quite satisfied with my purchase." }
    ]
  },
  {
    title: "Godrej Properties",
    image: "/airpirt.jpeg",
    logo: "/canada.jpeg",
    projects: 36,
    description: "One of India's most trusted builders with a focus on sustainable, environment-friendly development.",
    established: "1990",
    headquarters: "Mumbai",
    specialization: "Residential Apartments, Eco-friendly Projects",
    rating: 4.3,
    completed: 30,
    ongoing: 6,
    about: "Godrej Properties brings the Godrej Group philosophy of innovation and excellence to the real estate industry. The company focuses on delivering superior value to all stakeholders through extraordinary and imaginative spaces created out of deep customer focus and insight.",
    projects_list: [
      { name: "Godrej Woods", location: "Noida", status: "Ongoing", type: "Luxury" },
      { name: "Godrej Meridien", location: "Gurgaon", status: "Completed", type: "Premium" },
      { name: "Godrej South Estate", location: "Delhi", status: "Completed", type: "Luxury" }
    ],
    reviews: [
      { user: "Vikram Mehta", rating: 4.5, date: "2023-06-18", text: "Godrej Properties has an excellent reputation for quality and timely delivery. Very happy with my investment." },
      { user: "Neha Gupta", rating: 4.0, date: "2023-05-22", text: "Good amenities and eco-friendly initiatives. The green spaces in their projects are well-maintained." }
    ]
  },
  {
    title: "Prestige Group",
    image: "/image1.jpg",
    logo: "/dwarka.jpeg",
    projects: 52,
    description: "Southern India's premier developer with distinctive properties in residential and commercial sectors.",
    established: "1986",
    headquarters: "Bangalore",
    specialization: "Mixed-use Development, Tech Parks",
    rating: 4.7,
    completed: 45,
    ongoing: 7,
    about: "The Prestige Group has built a strong reputation for its quality residential, commercial, retail, leisure, and hospitality projects. Their developments span across South India with a significant presence in Bangalore, Chennai, and Hyderabad.",
    projects_list: [
      { name: "Prestige Leela Residences", location: "Bangalore", status: "Completed", type: "Ultra Luxury" },
      { name: "Prestige Tech Platina", location: "Bangalore", status: "Completed", type: "Commercial" },
      { name: "Prestige Falcon City", location: "Bangalore", status: "Ongoing", type: "Mixed Use" }
    ],
    reviews: [
      { user: "Karthik S", rating: 4.9, date: "2023-07-05", text: "Prestige Group is one of the best developers in South India. Their attention to detail and quality construction is unmatched." },
      { user: "Anjali R", rating: 4.7, date: "2023-04-12", text: "My office is in a Prestige commercial property and the maintenance is excellent. Great infrastructure and amenities." }
    ]
  },
  {
    title: "Sobha Limited",
    image: "/canada.jpeg",
    logo: "/image3.webp",
    projects: 29,
    description: "Known for their impeccable quality standards and attention to detail in construction.",
    established: "1995",
    headquarters: "Bangalore",
    specialization: "Premium Apartments, Villas",
    rating: 4.6,
    completed: 24,
    ongoing: 5,
    about: "Sobha Limited is one of India's most respected real estate brands, known for its unwavering commitment to quality. The company's backward integration model ensures complete control over the construction process from concept to completion.",
    projects_list: [
      { name: "Sobha Dream Acres", location: "Bangalore", status: "Completed", type: "Apartment" },
      { name: "Sobha Indraprastha", location: "Bangalore", status: "Completed", type: "Luxury Villa" },
      { name: "Sobha City", location: "Gurgaon", status: "Ongoing", type: "Township" }
    ],
    reviews: [
      { user: "Rajesh Kumar", rating: 4.8, date: "2023-08-02", text: "Sobha's quality is simply outstanding. Their craftsmanship and attention to detail is visible in every corner of their projects." },
      { user: "Meena Verma", rating: 4.4, date: "2023-03-18", text: "Good amenities and excellent construction quality. Slightly on the expensive side but worth the investment." }
    ]
  },
  {
    title: "Lodha Group",
    image: "/dwarka.jpeg",
    logo: "/image1.jpg",
    projects: 41,
    description: "India's largest real estate developer by sales volume, known for iconic developments.",
    established: "1980",
    headquarters: "Mumbai",
    specialization: "Ultra-luxury Residences, Townships",
    rating: 4.2,
    completed: 35,
    ongoing: 6,
    about: "The Lodha Group is India's largest real estate developer by sales. The company has transformed Mumbai's skyline with landmark developments and has expanded its presence to London and other international markets.",
    projects_list: [
      { name: "Lodha World Towers", location: "Mumbai", status: "Completed", type: "Ultra Luxury" },
      { name: "Lodha Belmondo", location: "Pune", status: "Completed", type: "Township" },
      { name: "Lodha Palava", location: "Mumbai", status: "Ongoing", type: "Smart City" }
    ],
    reviews: [
      { user: "Sanjay Mehta", rating: 4.3, date: "2023-07-12", text: "Lodha builds iconic projects with excellent facilities. Their premium apartments offer great value despite the high price tag." },
      { user: "Pooja Shah", rating: 4.0, date: "2023-02-28", text: "Good investment but customer service could be better. The township facilities are excellent though." }
    ]
  },
  {
    title: "Hiranandani Group",
    image: "/image3.webp",
    logo: "/airpirt.jpeg",
    projects: 38,
    description: "Pioneers in creating integrated township models in India with world-class infrastructure.",
    established: "1978",
    headquarters: "Mumbai",
    specialization: "Integrated Townships, Healthcare Projects",
    rating: 4.4,
    completed: 30,
    ongoing: 8,
    about: "The Hiranandani Group has transformed the real estate skyline of Mumbai with their integrated township model. They are known for creating self-contained communities with excellent infrastructure, amenities, and greenery.",
    projects_list: [
      { name: "Hiranandani Gardens", location: "Mumbai", status: "Completed", type: "Township" },
      { name: "Hiranandani Estate", location: "Thane", status: "Completed", type: "Township" },
      { name: "Hiranandani Parks", location: "Chennai", status: "Ongoing", type: "Township" }
    ],
    reviews: [
      { user: "Arjun Pai", rating: 4.7, date: "2023-06-30", text: "Hiranandani townships are like mini-cities with everything you need. Excellent planning and maintenance." },
      { user: "Sneha Joshi", rating: 4.2, date: "2023-05-15", text: "Great community living but prices are on the higher side. Still, the amenities and surroundings make it worth it." }
    ]
  },
  {
    title: "Brigade Group",
    image: "/image1.jpg",
    logo: "/canada.jpeg",
    projects: 32,
    description: "A leading property developer focused on innovation and customer satisfaction.",
    established: "1986",
    headquarters: "Bangalore",
    specialization: "Residential, Hospitality",
    rating: 4.3,
    completed: 27,
    ongoing: 5,
    about: "Brigade Group is one of South India's leading property developers with projects spanning residential, commercial, retail, hospitality, and education sectors. They have a strong presence in Bangalore, Mysore, Hyderabad, Chennai, and Kochi.",
    projects_list: [
      { name: "Brigade Orchards", location: "Bangalore", status: "Completed", type: "Township" },
      { name: "Brigade Utopia", location: "Bangalore", status: "Ongoing", type: "Apartment" },
      { name: "Brigade Meadows", location: "Bangalore", status: "Completed", type: "Integrated Enclave" }
    ],
    reviews: [
      { user: "Ramesh S", rating: 4.4, date: "2023-07-18", text: "Brigade has established a solid reputation in Bangalore. Their projects are well-designed and maintained." },
      { user: "Lakshmi N", rating: 4.1, date: "2023-03-25", text: "Good value for money and nice amenities. The location of their projects is usually convenient." }
    ]
  },
  {
    title: "Tata Housing",
    image: "/airpirt.jpeg",
    logo: "/dwarka.jpeg",
    projects: 45,
    description: "Part of the Tata Group, known for quality construction and ethical business practices.",
    established: "1984",
    headquarters: "Mumbai",
    specialization: "Affordable Luxury, Sustainable Homes",
    rating: 4.5,
    completed: 38,
    ongoing: 7,
    about: "Tata Housing is a subsidiary of Tata Sons and one of India's most trusted real estate developers. The company carries forward the Tata Group's legacy of ethics, quality, and customer-centricity in the real estate sector.",
    projects_list: [
      { name: "Tata Primanti", location: "Gurgaon", status: "Completed", type: "Luxury" },
      { name: "Tata Housing Avenida", location: "Kolkata", status: "Completed", type: "Premium" },
      { name: "Tata New Haven", location: "Bangalore", status: "Ongoing", type: "Affordable" }
    ],
    reviews: [
      { user: "Anand Kumar", rating: 4.6, date: "2023-08-10", text: "The Tata brand ensures quality and trustworthiness. Their projects are well-designed with good space utilization." },
      { user: "Sunita Reddy", rating: 4.3, date: "2023-04-05", text: "Impressed with their sustainable initiatives and green building practices. Good value for money too." }
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create Builder model
const Builder = mongoose.model('Builder', BuilderSchema);

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Builder.deleteMany({});
    console.log('Deleted existing builders');

    // Insert new data
    const createdBuilders = await Builder.insertMany(buildersData);
    console.log(`Added ${createdBuilders.length} builders to the database`);
    
    return createdBuilders;
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Main function
const main = async () => {
  const conn = await connectDB();
  
  try {
    await seedDatabase();
    console.log('Database seeded successfully!');
  } finally {
    // Close the connection
    await conn.disconnect();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the main function
main(); 