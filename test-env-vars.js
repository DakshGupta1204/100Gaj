// Load environment variables first
require('dotenv').config({ path: '.env.local' });

// Simple script to test environment variables
console.log("🔍 Testing Environment Variables:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Present" : "❌ Missing");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Present" : "❌ Missing");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Present" : "❌ Missing");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Present" : "❌ Missing");
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ Present" : "❌ Missing");

// Test Cloudinary configuration
try {
  const { v2: cloudinary } = require("cloudinary");
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("\n🏗️ Cloudinary Configuration:");
  console.log("Cloud Name:", cloudinary.config().cloud_name || "❌ Missing");
  console.log("API Key:", cloudinary.config().api_key ? "✅ Present" : "❌ Missing");
  console.log("API Secret:", cloudinary.config().api_secret ? "✅ Present" : "❌ Missing");
  
  // Test basic Cloudinary API call
  console.log("\n🔌 Testing Cloudinary Connection...");
  cloudinary.api.ping()
    .then(result => {
      console.log("✅ Cloudinary connection successful:", result);
    })
    .catch(error => {
      console.error("❌ Cloudinary connection failed:", error.message);
    });
    
} catch (error) {
  console.error("❌ Error testing Cloudinary:", error.message);
}
