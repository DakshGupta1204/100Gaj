import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["investor", "owner", "admin"],
    default: "investor",
  },
  kycStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpiry: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.EquityUser || mongoose.model("EquityUser", userSchema);

export default User;