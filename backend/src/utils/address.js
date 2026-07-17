const formatAddress = (address, legacyAddress = "") => {
    const parts = address
        ? [
            address.line1,
            address.line2,
            address.city,
            address.state,
            address.postalCode,
            address.country
        ].filter(Boolean)
        : [];

    return parts.length ? parts.join(", ") : legacyAddress || "-";
};

module.exports = {
    formatAddress
};
