const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    hashToken
};