const mongoose = require("mongoose");

const adminOtpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 100,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
        },
        otpHash: {
            type: String,
            required: true,
            select: false
        },
        attempts: {
            type: Number,
            default: 0,
            min: 0,
            select: false
        },
        lockedUntil: {
            type: Date,
            default: null,
            select: false
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

adminOtpSchema.index({ email: 1 }, { unique: true });
adminOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("AdminOtp", adminOtpSchema);
