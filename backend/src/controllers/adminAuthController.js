const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const AdminOtp = require("../models/AdminOtp");
const generateOtp = require("../utils/generateOtp");
const { hashOtp, verifyOtpHash } = require("../utils/otpSecurity");
const { setAdminCookie, clearAdminCookie } = require("../utils/authCookie");
const { isStrongPassword } = require("../utils/password");
const { sendAdminResetOtpEmail } = require("../services/adminEmailService");

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

const adminLogin = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const admin = await Admin.findOne({ email }).select("+passwordHash");
        const isMatch = admin
            ? await bcrypt.compare(password, admin.passwordHash)
            : false;

        if (!admin || !isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "Server configuration error"
            });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, purpose: "admin-session" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        setAdminCookie(res, token);

        return res.status(200).json({
            message: "Login successful",
            admin: { name: admin.name, email: admin.email }
        });
    } catch (error) {
        console.error("Admin login error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAdminSession = async (req, res) => {
    return res.status(200).json({
        authenticated: true,
        admin: {
            id: req.admin.id,
            email: req.admin.email
        }
    });
};

const logoutAdmin = async (req, res) => {
    clearAdminCookie(res);
    return res.status(200).json({ message: "Logged out successfully" });
};

const sendAdminOtp = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const genericResponse = {
            message: "If this admin account exists, a reset code has been sent."
        };
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(200).json(genericResponse);
        }

        const current = await AdminOtp.findOne({ email })
            .select("+otpHash +attempts +lockedUntil");
        const now = new Date();

        if (current?.lockedUntil && current.lockedUntil > now) {
            return res.status(429).json({
                message: "Too many invalid attempts. Please try again later."
            });
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await AdminOtp.findOneAndUpdate(
            { email },
            {
                email,
                otpHash: hashOtp(email, otp),
                attempts: 0,
                lockedUntil: null,
                expiresAt
            },
            { upsert: true, new: true, runValidators: true }
        );

        try {
            await sendAdminResetOtpEmail({ email, otp });
        } catch (emailError) {
            await AdminOtp.deleteOne({ email });
            console.error("Admin reset email error:", emailError.message);

            if (process.env.NODE_ENV !== "production") {
                return res.status(500).json({
                    message: "Unable to send reset code. Check SMTP configuration."
                });
            }
        }

        return res.status(200).json({
            ...genericResponse,
            ...(process.env.NODE_ENV !== "production" ? { otp } : {})
        });
    } catch (error) {
        console.error("Admin OTP error:", error.message);
        return res.status(500).json({
            message:
                process.env.NODE_ENV === "production"
                    ? "Unable to send reset code"
                    : error.message
        });
    }
};

const resetAdminPassword = async (req, res) => {
    try {
        const email = String(req.body.email || "").toLowerCase().trim();
        const otp = String(req.body.otp || "");
        const newPassword = String(req.body.newPassword || "");

        if (!email || !/^\d{6}$/.test(otp) || !newPassword) {
            return res.status(400).json({
                message: "Email, 6-digit OTP and new password are required"
            });
        }

        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({
                message: "Password must be at least 10 characters and include uppercase, lowercase, number and special character"
            });
        }

        const otpData = await AdminOtp.findOne({ email })
            .select("+otpHash +attempts +lockedUntil");
        const now = new Date();

        if (!otpData || otpData.expiresAt < now) {
            if (otpData) await AdminOtp.deleteOne({ _id: otpData._id });
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        if (otpData.lockedUntil && otpData.lockedUntil > now) {
            return res.status(429).json({
                message: "Too many invalid attempts. Please try again later."
            });
        }

        if (!verifyOtpHash(email, otp, otpData.otpHash)) {
            otpData.attempts += 1;

            if (otpData.attempts >= MAX_ATTEMPTS) {
                otpData.lockedUntil = new Date(Date.now() + LOCK_MS);
                otpData.expiresAt = otpData.lockedUntil;
                await otpData.save();
                return res.status(429).json({
                    message: "Too many invalid attempts. Reset is temporarily locked."
                });
            }

            await otpData.save();
            return res.status(400).json({
                message: `Invalid OTP. ${MAX_ATTEMPTS - otpData.attempts} attempts remaining.`
            });
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);
        const updated = await Admin.findOneAndUpdate(
            { email },
            { passwordHash }
        );

        if (!updated) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        await AdminOtp.deleteOne({ _id: otpData._id });
        clearAdminCookie(res);

        return res.status(200).json({
            message: "Password reset successful. Please sign in again."
        });
    } catch (error) {
        console.error("Admin reset error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    adminLogin,
    getAdminSession,
    logoutAdmin,
    sendAdminOtp,
    resetAdminPassword
};
