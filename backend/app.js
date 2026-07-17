const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const createLimiter = (max, message) =>
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: { message }
    });

const app = express();
const trustProxy = process.env.TRUST_PROXY;

app.disable("x-powered-by");
if (trustProxy) app.set("trust proxy", Number(trustProxy) || trustProxy);

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

app.use("/api/admin/login", createLimiter(5, "Too many login attempts. Please try again after 15 minutes."));
app.use("/api/admin/forgot-password", createLimiter(5, "Too many reset requests. Please try again after 15 minutes."));
app.use("/api/admin/reset-password", createLimiter(10, "Too many reset attempts. Please try again after 15 minutes."));
app.use("/api/auth/check-user", createLimiter(30, "Too many lookup attempts. Please try again after 15 minutes."));
app.use("/api/otp/send", createLimiter(5, "Too many OTP requests. Please try again after 15 minutes."));
app.use("/api/otp/verify", createLimiter(10, "Too many OTP attempts. Please try again after 15 minutes."));
app.use("/api/visit/create", createLimiter(20, "Too many visit requests. Please try again later."));

app.use("/api/otp", require("./src/routes/otpRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/history", require("./src/routes/historyRoutes"));
app.use("/api/visit", require("./src/routes/visitRoutes"));

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    console.error("Unhandled error:", error.message);
    if (res.headersSent) return next(error);
    return res.status(500).json({ message: "Server error" });
});

module.exports = app;
