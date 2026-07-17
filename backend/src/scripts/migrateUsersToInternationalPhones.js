const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const { normalizePhone } = require("../utils/phone");

dotenv.config();

const buildLegacyAddress = (legacyFrom) => ({
    line1: legacyFrom || "Legacy address - review required",
    line2: "",
    countryCode: process.env.LEGACY_DEFAULT_COUNTRY_CODE || "IN",
    country: process.env.LEGACY_DEFAULT_COUNTRY || "India",
    stateCode: process.env.LEGACY_DEFAULT_STATE_CODE || "",
    state: process.env.LEGACY_DEFAULT_STATE || "Not provided",
    city: process.env.LEGACY_DEFAULT_CITY || legacyFrom || "Not provided",
    postalCode: process.env.LEGACY_DEFAULT_POSTAL_CODE || "000000"
});

const runMigration = async () => {
    await connectDB();

    const report = {
        totalUsers: 0,
        updatedPhones: 0,
        removedPins: 0,
        migratedAddresses: 0,
        addressesPendingReview: 0,
        skippedInvalidPhones: 0,
        skippedDuplicates: 0
    };
    const users = await User.collection.find({}).toArray();
    report.totalUsers = users.length;

    for (const user of users) {
        const set = {};
        const unset = {};
        const normalizedPhone = normalizePhone(user.phone);

        if (user.pinHash) {
            unset.pinHash = "";
            report.removedPins += 1;
        }

        if (!normalizedPhone) {
            report.skippedInvalidPhones += 1;
        } else if (normalizedPhone !== user.phone) {
            const duplicate = await User.collection.findOne({
                phone: normalizedPhone,
                _id: { $ne: user._id }
            });

            if (duplicate) {
                report.skippedDuplicates += 1;
            } else {
                set.phone = normalizedPhone;
                report.updatedPhones += 1;
            }
        }

        if (!user.address?.line1) {
            const legacyFrom = String(user.from || user.legacyAddress || "").trim();
            set.address = buildLegacyAddress(legacyFrom);
            set.legacyAddress = legacyFrom;
            set.addressMigrationStatus = "pending-review";
            report.migratedAddresses += 1;
            report.addressesPendingReview += 1;
        } else {
            set.addressMigrationStatus = user.addressMigrationStatus || "complete";
        }

        if (Object.hasOwn(user, "from")) unset.from = "";

        const update = {};
        if (Object.keys(set).length) update.$set = set;
        if (Object.keys(unset).length) update.$unset = unset;

        if (Object.keys(update).length) {
            await User.collection.updateOne({ _id: user._id }, update);
        }
    }

    console.log("User migration completed");
    console.table(report);
    console.log("Records marked pending-review need a real structured address checked by an admin.");
};

runMigration()
    .catch((error) => {
        console.error("Migration failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
