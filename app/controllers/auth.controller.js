const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

exports.sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = await authService.sendOTP(phoneNumber);
    console.log("otp, phoneNumber", otp, phoneNumber);
    res.status(201).json(new ApiResponse(true, 'OTP sent successfully', otp));
}
exports.verifyOTP = async (req, res) => {
    const { phoneNumber, otp, referralCode } = req.body;
    const { user, token } = await authService.verifyOTP(phoneNumber, otp, referralCode);
    res.cookie('accessToken', token.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict', // 'Lax', 'None'
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(201).json(new ApiResponse(true, "User registered", { user, token }));
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    const { accessToken } = await authService.refreshToken(refreshToken);
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict', // 'Lax', 'None'
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(201).json(new ApiResponse(true, "Token refreshed", { accessToken }));
}

exports.logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.status(200).json(new ApiResponse(true, "Logged out successfully", null));
}
