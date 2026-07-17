const mongoose = require("mongoose");

const visitVerificationSchema = new mongoose.Schema(
    {
        tokenId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

visitVerificationSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
    "VisitVerification",
    visitVerificationSchema
);
