const { VISITOR_TYPES, getOtherType } = require("../constants/visitorTypes");
const { cleanText } = require("../utils/text");

const VALID_CATEGORIES = Object.keys(VISITOR_TYPES);
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const validateCategory = (category) => VALID_CATEGORIES.includes(category);

const validateAndSanitizeRegistration = (registrationData, category) => {
    if (!registrationData || typeof registrationData !== "object") {
        return { error: "Registration details are required" };
    }

    const firstName = cleanText(registrationData.firstName, 50);
    const lastName = cleanText(registrationData.lastName, 50);
    const email = cleanText(registrationData.email, 100).toLowerCase();
    const typeOption = cleanText(registrationData.typeOption, 100);
    const type = cleanText(registrationData.type, 100);
    const address = registrationData.address || {};

    if (firstName.length < 2) {
        return { error: "First name must contain at least 2 characters" };
    }

    if (email && !EMAIL_PATTERN.test(email)) {
        return { error: "A valid email address is required" };
    }

    if (!validateCategory(category)) {
        return { error: "A valid visitor category is required" };
    }

    if (!typeOption || !type) {
        return { error: "Visitor type is required" };
    }

    if (!VISITOR_TYPES[category]?.includes(typeOption)) {
        return { error: "Selected visitor type is not valid for this category" };
    }

    const otherType = getOtherType(category);

    if (typeOption !== otherType && type !== typeOption) {
        return { error: "Visitor type does not match the selected option" };
    }

    if (typeOption === otherType && type.length < 2) {
        return { error: "Please specify the visitor type" };
    }

    const sanitizedAddress = {
        line1: cleanText(address.line1, 150),
        line2: cleanText(address.line2, 150),
        countryCode: cleanText(address.countryCode, 2).toUpperCase(),
        country: cleanText(address.country, 100),
        stateCode: cleanText(address.stateCode, 10),
        state: cleanText(address.state, 100),
        city: cleanText(address.city, 100),
        postalCode: cleanText(address.postalCode, 20)
    };

    const requiredAddressValues = [
        sanitizedAddress.line1,
        sanitizedAddress.countryCode,
        sanitizedAddress.country,
        sanitizedAddress.state,
        sanitizedAddress.city,
        sanitizedAddress.postalCode
    ];

    if (requiredAddressValues.some((value) => !value)) {
        return { error: "Complete address details are required" };
    }

    return {
        registrationData: {
            firstName,
            lastName,
            email,
            category,
            typeOption,
            type,
            address: sanitizedAddress
        }
    };
};

module.exports = {
    VALID_CATEGORIES,
    validateCategory,
    validateAndSanitizeRegistration
};
