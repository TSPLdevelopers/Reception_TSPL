const express = require("express");
const {
    sendOtp,
    verifyOtp,
    clearVerification
} = require("../controllers/otpController");

const router = express.Router();

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);
router.post("/clear-verification", clearVerification);

module.exports = router;
