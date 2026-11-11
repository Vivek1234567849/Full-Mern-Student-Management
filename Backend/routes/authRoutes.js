
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    register,
    login,
    logout,
    refresh,
    me
} = require("../controllers/authController");

// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

// Protected Profile Route
router.get("/me", authMiddleware, me);

module.exports = router;
