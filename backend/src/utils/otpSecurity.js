const crypto = require("crypto");

const getOtpSecret = () =>
    process.env.OTP_HASH_SECRET ||
    process.env.OTP_VERIFICATION_SECRET ||
    process.env.JWT_SECRET;

const hashOtp = (identifier, otp) => {
    const secret = getOtpSecret();

    if (!secret) {
        throw new Error("OTP hashing secret is not configured");
    }

    return crypto
        .createHmac("sha256", secret)
        .update(`${String(identifier).trim().toLowerCase()}:${String(otp)}`)
        .digest("hex");
};

const verifyOtpHash = (identifier, otp, expectedHash) => {
    if (!expectedHash || typeof expectedHash !== "string") return false;

    const actualHash = hashOtp(identifier, otp);
    const actualBuffer = Buffer.from(actualHash, "hex");
    const expectedBuffer = Buffer.from(expectedHash, "hex");

    return (
        actualBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    );
};

module.exports = {
    hashOtp,
    verifyOtpHash
};
