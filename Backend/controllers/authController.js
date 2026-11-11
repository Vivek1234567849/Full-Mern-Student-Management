const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} = require("../utils/generateTokens");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/auth"
};

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = hashToken(refreshToken);
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REFRESH ACCESS TOKEN
exports.refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                message: "Refresh token missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== hashToken(token)) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = hashToken(newRefreshToken);
        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });

    } catch (error) {
        res.clearCookie("refreshToken", cookieOptions);

        res.status(401).json({
            message: "Refresh token expired or invalid"
        });
    }
};

// LOGOUT
exports.logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            const decoded = jwt.verify(
                token,
                process.env.REFRESH_TOKEN_SECRET
            );

            const user = await User.findById(decoded.id);

            if (user && user.refreshToken === hashToken(token)) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.clearCookie("refreshToken", cookieOptions);

        res.json({ message: "Logout successful" });

    } catch (error) {
        res.clearCookie("refreshToken", cookieOptions);
        res.json({ message: "Logout successful" });
    }
};
exports.me = async (req, res) => {
    const user = await User.findById(req.user.id)
        .select("-password -refreshToken");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json({ user });
};