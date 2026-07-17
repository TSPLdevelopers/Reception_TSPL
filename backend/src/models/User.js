const mongoose = require("mongoose");
const createAddressSchema = require("./schemas/addressSchema");
const visitSchema = require("./schemas/visitSchema");

const userSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/^\+[1-9]\d{7,14}$/, "Phone must be in E.164 format"]
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        lastName: {
            type: String,
            default: "",
            trim: true,
            maxlength: 50
        },
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
            required: true,
            enum: ["client", "vendor", "official", "visitor"]
        },
        typeOption: {
            type: String,
            default: "",
            trim: true,
            maxlength: 100
        },
        type: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        address: {
            type: createAddressSchema({ required: true }),
            required: true
        },
        legacyAddress: {
            type: String,
            default: "",
            trim: true,
            maxlength: 150,
            select: false
        },
        addressMigrationStatus: {
            type: String,
            enum: ["complete", "pending-review"],
            default: "complete"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        visitCount: {
            type: Number,
            default: 0,
            min: 0
        },
        visits: [visitSchema]
    },
    { timestamps: true }
);

userSchema.index({ category: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ "address.city": 1 });

module.exports = mongoose.model("User", userSchema);
