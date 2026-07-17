const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
    checkUser,
    searchUser
} = require("../controllers/authController");

const router = express.Router();

router.post("/check-user", checkUser);
router.get("/search/:phone", adminAuth, searchUser);

module.exports = router;
