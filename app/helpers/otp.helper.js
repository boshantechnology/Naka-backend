const redis = require('../config/redis');

const OTP_EXPIRY = 300;

exports.generateOTP = async (phoneNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // await redis.setex(`otp:${phoneNumber}`, OTP_EXPIRY, otp);
    await redis.set(`otp:${phoneNumber}`, otp);
    await redis.expire(`otp:${phoneNumber}`, OTP_EXPIRY);
    return otp;
};

exports.verifyOTP = async (phoneNumber, otp) => {
    const storedOtp = await redis.get(`otp:${phoneNumber}`);
    if (!storedOtp) throw new Error("Please login first");
    const isValid = storedOtp === otp;
    if (isValid) {
        await redis.del(`otp:${phoneNumber}`);
    } else {
        throw new Error("Please enter correct OTP");
    }
    return isValid;
};
