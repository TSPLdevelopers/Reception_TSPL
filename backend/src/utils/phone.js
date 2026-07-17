const {
    parsePhoneNumberFromString
} = require("libphonenumber-js/max");

const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

const normalizePhone = (value, defaultCountry = "IN") => {
    if (typeof value !== "string") return null;

    const cleanValue = value.trim();

    if (!cleanValue) return null;

    try {
        const parsedPhone = parsePhoneNumberFromString(
            cleanValue,
            cleanValue.startsWith("+") ? undefined : defaultCountry
        );

        if (!parsedPhone || !parsedPhone.isValid()) return null;

        return parsedPhone.number;
    } catch {
        return null;
    }
};

const getPhoneCandidates = (normalizedPhone) => {
    if (!normalizedPhone) return [];

    const candidates = [normalizedPhone];

    if (/^\+91\d{10}$/.test(normalizedPhone)) {
        candidates.push(normalizedPhone.slice(3));
    }

    return [...new Set(candidates)];
};

const isE164Phone = (value) => E164_PATTERN.test(String(value || ""));

module.exports = {
    normalizePhone,
    getPhoneCandidates,
    isE164Phone
};
