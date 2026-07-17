const User = require("../models/User");
const { getPhoneCandidates } = require("../utils/phone");

const findUserByPhone = (normalizedPhone, projection) =>
    User.findOne(
        { phone: { $in: getPhoneCandidates(normalizedPhone) } },
        projection
    );

module.exports = {
    findUserByPhone
};
