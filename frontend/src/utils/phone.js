import {
    getCountries,
    getCountryCallingCode,
    isValidPhoneNumber,
    parsePhoneNumberFromString
} from "libphonenumber-js/max";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

export const countryCodeToFlag = (countryCode) =>
    countryCode
        .toUpperCase()
        .replace(/./g, (character) =>
            String.fromCodePoint(127397 + character.charCodeAt(0))
        );

export const PHONE_COUNTRIES = getCountries()
    .map((countryCode) => ({
        value: countryCode,
        label: countryNames.of(countryCode) || countryCode,
        callingCode: getCountryCallingCode(countryCode),
        flag: countryCodeToFlag(countryCode)
    }))
    .sort((first, second) => first.label.localeCompare(second.label));

export const getCallingCode = (countryCode) =>
    getCountryCallingCode(countryCode || "IN");

export const getNationalDigits = (phone, countryCode) => {
    const callingCode = getCallingCode(countryCode);
    const digits = String(phone || "").replace(/\D/g, "");

    return digits.startsWith(callingCode)
        ? digits.slice(callingCode.length)
        : digits;
};

export const buildInternationalPhone = (countryCode, nationalDigits) => {
    const digits = String(nationalDigits || "").replace(/\D/g, "");

    if (!digits) return "";

    return `+${getCallingCode(countryCode)}${digits}`;
};

export const isValidInternationalPhone = (phone) => {
    try {
        return Boolean(phone) && isValidPhoneNumber(phone);
    } catch {
        return false;
    }
};

export const detectPhoneCountry = (phone, fallbackCountry = "IN") => {
    try {
        return parsePhoneNumberFromString(phone)?.country || fallbackCountry;
    } catch {
        return fallbackCountry;
    }
};
