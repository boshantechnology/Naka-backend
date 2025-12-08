const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn || '7d' });
};

exports.generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, jwtConfig.secret, {
        expiresIn: jwtConfig.accessTokenExpiry || '15m',
    });
};

exports.generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, jwtConfig.refreshSecret, {
        expiresIn: jwtConfig.refreshTokenExpiry || '7d',
    });
};

exports.verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (err) {
        return null;
    }
};
