const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
    adminLogin,
    getAdminSession,
    logoutAdmin,
    sendAdminOtp,
    resetAdminPassword
} = require("../controllers/adminAuthController");
const {
    getAllUsers,
    getDashboardStats,
    searchUsers
} = require("../controllers/adminDataController");

const router = express.Router();

router.post("/login", adminLogin);
router.post("/forgot-password", sendAdminOtp);
router.put("/reset-password", resetAdminPassword);
router.get("/session", adminAuth, getAdminSession);
router.post("/logout", adminAuth, logoutAdmin);
router.get("/all-users", adminAuth, getAllUsers);
router.get("/dashboard-stats", adminAuth, getDashboardStats);
router.get("/search-users", adminAuth, searchUsers);

module.exports = router;
