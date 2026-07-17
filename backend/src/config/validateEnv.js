const hasValue = (key) => Boolean(String(process.env[key] || "").trim());

const validateEnvironment = () => {
    const required = [
        "MONGO_URI",
        "JWT_SECRET",
        "OTP_VERIFICATION_SECRET",
        "FRONTEND_URL"
    ];
    const missing = required.filter((key) => !hasValue(key));

    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    if (process.env.NODE_ENV !== "production") return;

    const secrets = [
        ["JWT_SECRET", process.env.JWT_SECRET],
        ["OTP_VERIFICATION_SECRET", process.env.OTP_VERIFICATION_SECRET],
        ["OTP_HASH_SECRET", process.env.OTP_HASH_SECRET]
    ];

    for (const [name, value] of secrets) {
        if (!value || value.length < 32 || /replace|secret/i.test(value)) {
            throw new Error(`${name} must be a unique random value of at least 32 characters in production`);
        }
    }

    const mailVariables = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM"];
    const missingMail = mailVariables.filter((key) => !hasValue(key));

    if (missingMail.length) {
        throw new Error(`Production email configuration is incomplete: ${missingMail.join(", ")}`);
    }

    if ((process.env.SMS_PROVIDER || "").toLowerCase() !== "twilio") {
        throw new Error("SMS_PROVIDER must be set to twilio in production");
    }

    const missingTwilio = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"]
        .filter((key) => !hasValue(key));

    if (missingTwilio.length) {
        throw new Error(`Production Twilio configuration is incomplete: ${missingTwilio.join(", ")}`);
    }

    if (!hasValue("TWILIO_MESSAGING_SERVICE_SID") && !hasValue("TWILIO_FROM_NUMBER")) {
        throw new Error("Configure TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_NUMBER in production");
    }
};

module.exports = validateEnvironment;
