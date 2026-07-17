const twilio = require("twilio");

let twilioClient = null;

const getTwilioClient = () => {
    if (twilioClient) return twilioClient;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
        throw new Error("Twilio credentials are not configured");
    }

    twilioClient = twilio(accountSid, authToken);
    return twilioClient;
};

const sendOtp = async (phone, otp) => {
    if (process.env.NODE_ENV !== "production") {
        console.log("--------------------------------");
        console.log(`Development OTP for ${phone}: ${otp}`);
        console.log("--------------------------------");
        return;
    }

    if ((process.env.SMS_PROVIDER || "").toLowerCase() !== "twilio") {
        throw new Error("SMS provider is not configured");
    }

    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    const from = process.env.TWILIO_FROM_NUMBER;

    if (!messagingServiceSid && !from) {
        throw new Error(
            "Configure TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_NUMBER"
        );
    }

    const client = getTwilioClient();
    const messageOptions = {
        to: phone,
        body: `Your TechTorch Front Office verification code is ${otp}. It expires in 2 minutes.`
    };

    if (messagingServiceSid) {
        messageOptions.messagingServiceSid = messagingServiceSid;
    } else {
        messageOptions.from = from;
    }

    await client.messages.create(messageOptions);
};

module.exports = {
    sendOtp
};
