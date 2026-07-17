import VISITOR_TYPES from "@shared/visitor-types.json";

export { VISITOR_TYPES };

export const getVisitorTypeOptions = (category) =>
    (VISITOR_TYPES[category] || []).map((type) => ({
        value: type,
        label: type
    }));

export const getOtherVisitorType = (category) =>
    (VISITOR_TYPES[category] || []).find((type) => type.startsWith("Other")) || "Other";
