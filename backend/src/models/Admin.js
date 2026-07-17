const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "Reception Admin",
            trim: true,
            maxlength: 80
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 100,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);