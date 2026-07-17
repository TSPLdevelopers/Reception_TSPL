const nodemailer = require("nodemailer");

let transporter;

const getMailTransport = () => {
    if (transporter) return transporter;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) return null;

    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
    });

    return transporter;
};

const getFromAddress = () =>
    process.env.EMAIL_FROM ||
    `TechTorch Front Office <${process.env.SMTP_USER}>`;

module.exports = {
    getMailTransport,
    getFromAddress
};
