const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route to fetch the current user's profile
router.get("/me",authMiddleware, getUserProfile);

module.exports = router;
