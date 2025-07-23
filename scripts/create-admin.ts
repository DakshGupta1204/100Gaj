import connectDB from "../app/lib/mongodb";
import User from "../app/equity/models/User";
import * as bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await (User as any).findOne({ email: "admin@100gaj.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin@100gaj", 10);
    const admin = new User({
      name: "Admin",
      email: "admin@100gaj.com",
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@100gaj.com");
    console.log("Password: Admin@100gaj");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

createAdmin(); 