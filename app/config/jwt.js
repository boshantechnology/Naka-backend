module.exports = {
    secret: process.env.JWT_SECRET || 'access_secret_key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
    expiresIn: '7d',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d'
};
