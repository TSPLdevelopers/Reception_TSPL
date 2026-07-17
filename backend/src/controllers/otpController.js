const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const User = require("../models/User");
const VisitVerification = require("../models/VisitVerification");
const generateOtp = require("../utils/generateOtp");
const otpService = require("../services/otpService");
const { normalizePhone } = require("../utils/phone");
const { hashOtp, verifyOtpHash } = require("../utils/otpSecurity");
const {
    validateCategory,
    validateAndSanitizeRegistration
} = require("../services/registrationService");
const { findUserByPhone } = require("../services/userLookupService");
const {
    getCategoryMismatch,
    respondWithCategoryMismatch
} = require("../services/categoryAccessService");
const {
    setVisitVerificationCookie,
    clearVisitVerificationCookie
} = require("../utils/visitVerificationCookie");

const OTP_TTL_MS = 2 * 60 * 1000;
const OTP_LOCK_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const sendOtp = async (req, res) => {
    try {
        clearVisitVerificationCookie(res);
        const { phone, category, registrationData } = req.body;
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

        const existingUser = await findUserByPhone(normalizedPhone);
        const categoryMismatch = getCategoryMismatch(existingUser, category);

        if (categoryMismatch) {
            return respondWithCategoryMismatch(res, categoryMismatch);
        }

        let finalRegistrationData = null;

        if (registrationData) {
            if (existingUser) {
                return res.status(409).json({
                    message: "This phone number is already registered. Continue with OTP verification."
                });
            }

            const validation = validateAndSanitizeRegistration(
                registrationData,
                category
            );

            if (validation.error) {
                return res.status(400).json({ message: validation.error });
            }

            finalRegistrationData = validation.registrationData;
        } else if (!existingUser) {
            return res.status(404).json({
                message: "Registration details are required before OTP verification."
            });
        }

        const existingOtp = await Otp.findOne({ phone: normalizedPhone })
            .select("+otpHash +attempts +lockedUntil");
        const now = new Date();

        if (existingOtp?.lockedUntil && existingOtp.lockedUntil > now) {
            const remainingSeconds = Math.ceil(
                (existingOtp.lockedUntil.getTime() - Date.now()) / 1000
            );

            return res.status(429).json({
                message: "Too many invalid OTP attempts. Please try again later.",
                remainingSeconds
            });
        }

        if (existingOtp && existingOtp.expiresAt > now) {
            if (existingOtp.category === category) {
                if (finalRegistrationData) {
                    existingOtp.registrationData = finalRegistrationData;
                    await existingOtp.save();
                }

                return res.status(200).json({
                    message: "OTP already sent. Please use the current code.",
                    remainingSeconds: Math.ceil(
                        (existingOtp.expiresAt.getTime() - Date.now()) / 1000
                    )
                });
            }

            // An OTP is bound to one visitor category. Changing the category
            // invalidates the previous code and requires a fresh OTP.
            await Otp.deleteOne({ _id: existingOtp._id });
        } else {
            await Otp.deleteMany({ phone: normalizedPhone });
        }

        const otp = generateOtp();
        await otpService.sendOtp(normalizedPhone, otp);

        const expiresAt = new Date(Date.now() + OTP_TTL_MS);

        await Otp.create({
            phone: normalizedPhone,
            category,
            otpHash: hashOtp(normalizedPhone, otp),
            attempts: 0,
            lockedUntil: null,
            expiresAt,
            registrationData: finalRegistrationData
        });

        return res.status(200).json({
            message: "OTP sent successfully",
            remainingSeconds: Math.floor(OTP_TTL_MS / 1000),
            ...(process.env.NODE_ENV !== "production" ? { otp } : {})
        });
    } catch (error) {
        console.error("Send OTP error:", error.message);
        return res.status(500).json({
            message:
                process.env.NODE_ENV === "production"
                    ? "Unable to send OTP"
                    : error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { phone, otp, category } = req.body;
        const normalizedPhone = normalizePhone(phone);
        const cleanOtp = String(otp || "");

        if (!normalizedPhone) {
            return res.status(400).json({
                message: "A valid international phone number is required"
            });
        }

        if (!/^\d{6}$/.test(cleanOtp)) {
            return res.status(400).json({
                message: "OTP must be exactly 6 digits"
            });
        }

        if (!validateCategory(category)) {
            return res.status(400).json({
                message: "A valid visitor category is required"
            });
        }

        const existingUser = await findUserByPhone(normalizedPhone);
        const categoryMismatch = getCategoryMismatch(existingUser, category);

        if (categoryMismatch) {
            // Reject before reading, validating, or consuming the OTP.
            return respondWithCategoryMismatch(res, categoryMismatch);
        }

        const otpData = await Otp.findOne({
            phone: normalizedPhone,
            category
        }).select("+otpHash +attempts +lockedUntil");
        const now = new Date();

        if (!otpData) {
            return res.status(404).json({
                message: "OTP expired, not found, or was issued for a different category"
            });
        }

        if (otpData.lockedUntil && otpData.lockedUntil > now) {
            return res.status(429).json({
                message: "Too many invalid OTP attempts. Please request a new code later."
            });
        }

        if (otpData.expiresAt < now) {
            await Otp.deleteOne({ _id: otpData._id });
            return res.status(400).json({ message: "OTP expired" });
        }

        if (
            otpData.registrationData?.category &&
            otpData.registrationData.category !== category
        ) {
            return res.status(409).json({
                code: "CATEGORY_MISMATCH",
                message: "This OTP was issued for a different visitor category. Please request a new code."
            });
        }

        if (!verifyOtpHash(normalizedPhone, cleanOtp, otpData.otpHash)) {
            otpData.attempts += 1;

            if (otpData.attempts >= MAX_ATTEMPTS) {
                otpData.lockedUntil = new Date(Date.now() + OTP_LOCK_MS);
                otpData.expiresAt = otpData.lockedUntil;
                await otpData.save();

                return res.status(429).json({
                    message: "Too many invalid OTP attempts. Verification is temporarily locked."
                });
            }

            await otpData.save();
            return res.status(400).json({
                message: `Invalid OTP. ${MAX_ATTEMPTS - otpData.attempts} attempts remaining.`
            });
        }

        const consumedOtp = await Otp.findOneAndDelete({
            _id: otpData._id,
            phone: normalizedPhone,
            category,
            otpHash: otpData.otpHash,
            expiresAt: { $gt: now }
        }).select("+otpHash +attempts +lockedUntil");

        if (!consumedOtp) {
            return res.status(400).json({
                message: "OTP has already been used or expired"
            });
        }

        let user = existingUser;

        if (consumedOtp.registrationData?.firstName && !user) {
            try {
                user = await User.create({
                    phone: normalizedPhone,
                    ...consumedOtp.registrationData.toObject(),
                    isVerified: true,
                    addressMigrationStatus: "complete"
                });
            } catch (error) {
                if (error.code !== 11000) throw error;
                user = await findUserByPhone(normalizedPhone);
            }
        }

        if (!user) {
            return res.status(404).json({
                message: "Registration could not be completed. Please start again."
            });
        }

        const postRegistrationMismatch = getCategoryMismatch(user, category);
        if (postRegistrationMismatch) {
            return respondWithCategoryMismatch(res, postRegistrationMismatch);
        }

        const verificationSecret =
            process.env.OTP_VERIFICATION_SECRET || process.env.JWT_SECRET;

        if (!verificationSecret) {
            return res.status(500).json({
                message: "Server verification configuration is missing"
            });
        }

        const tokenId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await VisitVerification.deleteMany({ phone: normalizedPhone });
        await VisitVerification.create({ tokenId, phone: normalizedPhone, expiresAt });

        const verificationToken = jwt.sign(
            { tokenId, phone: normalizedPhone, purpose: "visit-entry" },
            verificationSecret,
            { expiresIn: "10m" }
        );

        setVisitVerificationCookie(res, verificationToken);

        return res.status(200).json({
            message: "OTP verified successfully"
        });
    } catch (error) {
        console.error("Verify OTP error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const clearVerification = async (req, res) => {
    clearVisitVerificationCookie(res);
    return res.status(200).json({ message: "Visit verification cleared" });
};

module.exports = {
    sendOtp,
    verifyOtp,
    clearVerification
};
