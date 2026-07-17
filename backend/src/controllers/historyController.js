const { normalizePhone } = require("../utils/phone");
const { findUserByPhone } = require("../services/userLookupService");

const getUserHistory = async (req, res) => {
    try {
        const normalizedPhone = normalizePhone(req.params.phone);

        if (!normalizedPhone) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        const user = await findUserByPhone(normalizedPhone, {
            phone: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            category: 1,
            type: 1,
            typeOption: 1,
            address: 1,
            addressMigrationStatus: 1,
            visitCount: 1,
            visits: 1,
            _id: 0
        }).lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getUserHistory
};
