const { getMailTransport, getFromAddress } = require("./mailTransport");
const { escapeHtml } = require("../utils/text");

const sendAdminResetOtpEmail = async ({ email, otp }) => {
    const transport = getMailTransport();

    if (!transport) {
        if (process.env.NODE_ENV !== "production") {
            console.log(`Admin password reset OTP for ${email}: ${otp}`);
            return { sent: false, reason: "smtp-not-configured" };
        }

        throw new Error("Admin password reset email is not configured");
    }

    await transport.sendMail({
        from: getFromAddress(),
        to: email,
        subject: "TechTorch Front Office admin password reset code",
        text: `Your TechTorch Front Office admin password reset code is ${otp}. It expires in 5 minutes.`,
        html: `
            <div style="margin:0;padding:24px;background:#f7f9ff;font-family:Arial,sans-serif;color:#111827;">
                <div style="max-width:560px;margin:auto;background:#fff;border:1px solid #e7eaf0;border-radius:22px;overflow:hidden;">
                    <div style="background:#730042;color:#fff;padding:24px 28px;">
                        <h1 style="margin:0;font-size:22px;">Admin password reset</h1>
                    </div>
                    <div style="padding:28px;">
                        <p>Hello ${escapeHtml(email)},</p>
                        <p>Use this one-time code to reset your TechTorch Front Office admin password:</p>
                        <div style="margin:24px 0;padding:18px;border-radius:14px;background:#f8eaf3;color:#730042;text-align:center;font-size:32px;font-weight:800;letter-spacing:8px;">${escapeHtml(otp)}</div>
                        <p style="color:#6b7280;">The code expires in 5 minutes. Do not share it with anyone.</p>
                    </div>
                </div>
            </div>
        `
    });

    return { sent: true };
};

module.exports = {
    sendAdminResetOtpEmail
};
