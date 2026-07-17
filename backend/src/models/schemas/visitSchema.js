const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
    {
        arrivalTime: {
            type: Date,
            required: true
        },
        reason: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        whomToMeet: {
            type: String,
            default: "-",
            trim: true,
            maxlength: 100
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);
