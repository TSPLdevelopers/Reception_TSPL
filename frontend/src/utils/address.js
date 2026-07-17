export const formatAddress = (address, legacyFrom = "") => {
    if (!address) return legacyFrom || "-";

    const parts = [
        address.line1,
        address.line2,
        address.city,
        address.state,
        address.postalCode,
        address.country
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : legacyFrom || "-";
};
