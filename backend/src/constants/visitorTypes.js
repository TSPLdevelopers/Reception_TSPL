const VISITOR_TYPES = require("../../../shared/visitor-types.json");

const getOtherType = (category) =>
    (VISITOR_TYPES[category] || []).find((value) => value.startsWith("Other"));

module.exports = {
    VISITOR_TYPES,
    getOtherType
};
