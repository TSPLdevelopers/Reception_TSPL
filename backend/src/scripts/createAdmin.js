const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const { isStrongPassword } = require("../utils/password");

dotenv.config();

const run = async () => {
    const email = String(process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const password = String(process.env.ADMIN_PASSWORD || "");
    const name = String(process.env.ADMIN_NAME || "Reception Admin").trim();

    if (!email || !password) {
        throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this command");
    }

    if (!isStrongPassword(password)) {
        throw new Error("ADMIN_PASSWORD must have 10+ characters, upper/lowercase, number and special character");
    }

    await connectDB();

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.findOneAndUpdate(
        { email },
        { name, email, passwordHash },
        { upsert: true, new: true, runValidators: true }
    );

    console.log(`Admin account ready: ${admin.email}`);
    process.exit(0);
};

run().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
