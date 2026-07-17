const { formatAddress } = require("../utils/address");
const { escapeHtml } = require("../utils/text");
const { getMailTransport, getFromAddress } = require("./mailTransport");

const buildVisitEmailHtml = ({ user, visit }) => {
    const fullName = `${user.firstName} ${user.lastName || ""}`.trim();
    const visitDate = new Date(visit.arrivalTime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });
    const details = [
        ["Category", user.category],
        ["Visitor Type", user.type],
        ["Phone", user.phone],
        ["Address", formatAddress(user.address, user.legacyAddress)],
        ["Visit Date & Time", visitDate],
        ["Reason", visit.reason],
        ["Whom To Meet", visit.whomToMeet]
    ];

    return `
        <div style="margin:0;padding:24px;background:#f7f9ff;font-family:Arial,sans-serif;color:#111827;">
            <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e7eaf0;border-radius:24px;overflow:hidden;box-shadow:0 14px 35px rgba(15,23,42,.08);">
                <div style="background:#730042;color:#fff;padding:28px 32px;">
                    <h1 style="margin:0;font-size:26px;">Welcome to TechTorch Solutions</h1>
                    <p style="margin:10px 0 0;opacity:.9;">Your front-office visit has been registered successfully.</p>
                </div>
                <div style="padding:30px 32px;">
                    <p style="font-size:16px;line-height:1.6;">Hello <strong>${escapeHtml(fullName)}</strong>,</p>
                    <p style="font-size:15px;line-height:1.7;color:#4b5563;">Thank you for visiting TechTorch Solutions. Your visit details are listed below.</p>
                    <table style="width:100%;border-collapse:collapse;margin-top:24px;"><tbody>
                        ${details.map(([label, value]) => `
                            <tr>
                                <td style="padding:12px 0;border-bottom:1px solid #eef0f4;color:#6b7280;font-weight:700;width:38%;">${escapeHtml(label)}</td>
                                <td style="padding:12px 0;border-bottom:1px solid #eef0f4;color:#111827;font-weight:700;">${escapeHtml(value || "-")}</td>
                            </tr>
                        `).join("")}
                    </tbody></table>
                    <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#6b7280;">Please show this message at the reception desk if assistance is required.</p>
                </div>
                <div style="background:#eef3ff;padding:18px 32px;color:#607089;font-size:12px;text-align:center;">© 2024 - 2026 TechTorch Solutions Private Limited</div>
            </div>
        </div>
    `;
};

const sendVisitEmail = async ({ user, visit }) => {
    if (!user.email) return { sent: false, reason: "no-email" };

    const transport = getMailTransport();

    if (!transport) {
        if (process.env.NODE_ENV !== "production") {
            console.log(`Visit email skipped for ${user.email}: SMTP is not configured`);
        }
        return { sent: false, reason: "smtp-not-configured" };
    }

    const fullName = `${user.firstName} ${user.lastName || ""}`.trim();

    await transport.sendMail({
        from: getFromAddress(),
        to: user.email,
        subject: `TechTorch visit confirmation - ${fullName}`,
        text: `Hello ${fullName}, your TechTorch visit has been registered successfully. Reason: ${visit.reason}. Whom to meet: ${visit.whomToMeet}.`,
        html: buildVisitEmailHtml({ user, visit })
    });

    return { sent: true };
};

module.exports = {
    sendVisitEmail,
    buildVisitEmailHtml
};
