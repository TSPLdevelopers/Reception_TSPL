const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
    getUserHistory
} = require("../controllers/historyController");

router.get("/:phone", adminAuth, getUserHistory);

module.exports = router;