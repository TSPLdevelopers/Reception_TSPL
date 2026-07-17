const { normalizePhone } = require("../utils/phone");
const { validateCategory } = require("../services/registrationService");
const { findUserByPhone } = require("../services/userLookupService");
const {
    getCategoryMismatch,
    respondWithCategoryMismatch
} = require("../services/categoryAccessService");

const checkUser = async (req, res) => {
    try {
        const { phone, category } = req.body;
        const normalizedPhone = normalizePhone(phone);

        if (!normalizedPhone) {
            return res.status(400).json({
                message: "A valid international phone number is required"
            });
        }

        if (!validateCategory(category)) {
            return res.status(400).json({
                message: "A valid visitor category is required"
            });
        }

        const user = await findUserByPhone(normalizedPhone, {
            _id: 1,
            category: 1
        });
        const mismatch = getCategoryMismatch(user, category);

        if (mismatch) {
            return respondWithCategoryMismatch(res, mismatch);
        }

        return res.status(200).json({
            exists: Boolean(user),
            phone: normalizedPhone
        });
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};

const searchUser = async (req, res) => {
    try {
        const normalizedPhone = normalizePhone(req.params.phone);

        if (!normalizedPhone) {
            return res.status(400).json({
                message: "A valid international phone number is required"
            });
        }

        const user = await findUserByPhone(normalizedPhone, {
            phone: 1,
            category: 1
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    checkUser,
    searchUser
};
