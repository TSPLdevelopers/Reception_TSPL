const jwt = require("jsonwebtoken");
const { ADMIN_COOKIE } = require("../utils/authCookie");

const adminAuth = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: "Server configuration error"
        });
    }

    const token = req.cookies?.[ADMIN_COOKIE];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.purpose !== "admin-session") {
            return res.status(401).json({ message: "Invalid admin session" });
        }

        req.admin = decoded;
        return next();
    } catch {
        return res.status(401).json({
            message: "Session expired. Please login again."
        });
    }
};

module.exports = adminAuth;
