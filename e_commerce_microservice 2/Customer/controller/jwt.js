const jwt = require('jsonwebtoken');
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require('./authUtils'); // Assume authUtils contains utility functions for token operations
const User = require('../models/User'); // Assume User model for database operations

const authenticateAccessToken = (req, res, next) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        return res.status(401).json({ message: 'Access token is missing.' });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid access token.' });
        }
        req.user = user;
        next();
    });
};

const authenticateRefreshToken = async (req, res, next) => {
    const refreshToken = req.headers.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is missing.' });
    }

    try {
        const decoded = await verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const issueNewTokens = async (user, res) => {
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: expireTime })
    const refreshToken = jwt.sign(payload, refreshsecretKey, { expiresIn: expireTime });

    // Update the user's refresh token in the database
    user.refreshToken = refreshToken;
    user.save();

    res.append('refreshToken', refreshToken, { httpOnly: true });

    return { accessToken, refreshToken };
};

module.exports = {
    authenticateAccessToken,
    authenticateRefreshToken,
    issueNewTokens,
};