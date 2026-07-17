const mongoose = require("mongoose");
const createAddressSchema = require("./schemas/addressSchema");

const registrationDataSchema = new mongoose.Schema(
    {
        firstName: { type: String, trim: true, minlength: 2, maxlength: 50 },
        lastName: { type: String, default: "", trim: true, maxlength: 50 },
        email: {
            type: String,
            default: "",
            trim: true,
            lowercase: true,
            maxlength: 100,
            match: [/^$|^\S+@\S+\.\S+$/, "Invalid email format"]
        },
        category: {
            type: String,
            enum: ["client", "vendor", "official", "visitor"]
        },
        typeOption: { type: String, trim: true, maxlength: 100 },
        type: { type: String, trim: true, maxlength: 100 },
        address: {
            type: createAddressSchema({ required: false }),
            default: null
        }
    },
    { _id: false }
);

const otpSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            trim: true,
            match: [/^\+[1-9]\d{7,14}$/, "Phone must be in E.164 format"]
        },
        category: {
            type: String,
            required: true,
            enum: ["client", "vendor", "official", "visitor"],
            index: true
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
        },
        registrationData: {
            type: registrationDataSchema,
            default: null
        }
    },
    { timestamps: true }
);

otpSchema.index({ phone: 1 }, { unique: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);
