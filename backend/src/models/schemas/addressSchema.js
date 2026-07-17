const mongoose = require("mongoose");

const createAddressSchema = ({ required = true } = {}) =>
    new mongoose.Schema(
        {
            line1: {
                type: String,
                required,
                trim: true,
                maxlength: 150
            },
            line2: {
                type: String,
                default: "",
                trim: true,
                maxlength: 150
            },
            countryCode: {
                type: String,
                required,
                trim: true,
                uppercase: true,
                minlength: required ? 2 : undefined,
                maxlength: 2
            },
            country: {
                type: String,
                required,
                trim: true,
                maxlength: 100
            },
            stateCode: {
                type: String,
                default: "",
                trim: true,
                maxlength: 10
            },
            state: {
                type: String,
                required,
                trim: true,
                maxlength: 100
            },
            city: {
                type: String,
                required,
                trim: true,
                maxlength: 100
            },
            postalCode: {
                type: String,
                required,
                trim: true,
                maxlength: 20
            }
        },
        { _id: false }
    );

module.exports = createAddressSchema;
