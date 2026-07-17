const CATEGORY_LABELS = Object.freeze({
    client: "Client",
    vendor: "Vendor",
    official: "Official",
    visitor: "Visitor"
});

const getCategoryLabel = (category) =>
    CATEGORY_LABELS[category] || "selected";

const getCategoryMismatch = (user, requestedCategory) => {
    if (!user?.category || user.category === requestedCategory) {
        return null;
    }

    const registeredCategory = user.category;
    const registeredLabel = getCategoryLabel(registeredCategory);

    return {
        code: "CATEGORY_MISMATCH",
        registeredCategory,
        message: `This phone number is registered as ${registeredLabel}. Please continue from the ${registeredLabel} section.`
    };
};

const respondWithCategoryMismatch = (res, mismatch) =>
    res.status(409).json(mismatch);

module.exports = {
    CATEGORY_LABELS,
    getCategoryLabel,
    getCategoryMismatch,
    respondWithCategoryMismatch
};
