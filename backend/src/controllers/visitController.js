const jwt = require("jsonwebtoken");
const User = require("../models/User");
const VisitVerification = require("../models/VisitVerification");
const { sendVisitEmail } = require("../services/visitEmailService");
const {
    VISIT_VERIFICATION_COOKIE,
    clearVisitVerificationCookie
} = require("../utils/visitVerificationCookie");
const {
    getPhoneCandidates,
    normalizePhone
} = require("../utils/phone");

const createVisit = async (req, res) => {
    try {
        const {
            phone,
            reason,
            whomToMeet
        } = req.body;
        const verificationToken = req.cookies?.[VISIT_VERIFICATION_COOKIE];

        const normalizedPhone = normalizePhone(phone);

        if (!normalizedPhone) {
            return res.status(400).json({
                message: "A valid international phone number is required"
            });
        }

        const cleanReason = String(reason || "").trim();
        const cleanWhomToMeet = String(whomToMeet || "").trim();

        if (!cleanReason || !cleanWhomToMeet) {
            return res.status(400).json({
                message: "Reason and Whom To Meet are required"
            });
        }

        if (cleanReason.length > 200 || cleanWhomToMeet.length > 100) {
            return res.status(400).json({
                message: "Visit details are too long"
            });
        }

        if (!verificationToken) {
            clearVisitVerificationCookie(res);
            return res.status(401).json({
                message: "OTP verification is required"
            });
        }

        const verificationSecret =
            process.env.OTP_VERIFICATION_SECRET || process.env.JWT_SECRET;

        if (!verificationSecret) {
            return res.status(500).json({
                message: "Server verification configuration is missing"
            });
        }

        let payload;

        try {
            payload = jwt.verify(verificationToken, verificationSecret);
        } catch {
            clearVisitVerificationCookie(res);
            return res.status(401).json({
                message: "OTP verification expired. Please verify again."
            });
        }

        if (
            payload.purpose !== "visit-entry" ||
            payload.phone !== normalizedPhone ||
            !payload.tokenId
        ) {
            clearVisitVerificationCookie(res);
            return res.status(403).json({
                message: "Invalid OTP verification proof"
            });
        }

        const user = await User.findOne({
            phone: {
                $in: getPhoneCandidates(normalizedPhone)
            }
        });

        if (!user) {
            clearVisitVerificationCookie(res);
            return res.status(404).json({
                message: "User not found"
            });
        }

        const verification = await VisitVerification.findOneAndDelete({
            tokenId: payload.tokenId,
            phone: normalizedPhone,
            expiresAt: {
                $gt: new Date()
            }
        });

        if (!verification) {
            clearVisitVerificationCookie(res);
            return res.status(401).json({
                message: "OTP verification has expired or was already used"
            });
        }

        clearVisitVerificationCookie(res);

        const visit = {
            arrivalTime: new Date(),
            reason: cleanReason,
            whomToMeet: cleanWhomToMeet
        };

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $inc: {
                    visitCount: 1
                },
                $push: {
                    visits: visit
                }
            },
            {
                new: true,
                runValidators: false
            }
        );

        let emailSent = false;

        try {
            const emailResult = await sendVisitEmail({
                user: updatedUser,
                visit
            });
            emailSent = emailResult.sent;
        } catch (emailError) {
            console.error("Visit email error:", emailError.message);
        }

        return res.status(200).json({
            message: "Visit Added Successfully",
            visitCount: updatedUser.visitCount,
            emailSent
        });
    } catch (error) {
        console.error("Create visit error:", error.message);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createVisit
};
