"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.default.Schema({
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
var User = mongoose_1.default.models.EquityUser || mongoose_1.default.model("EquityUser", userSchema);
exports.default = User;
