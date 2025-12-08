const User = require("../models/user.model");
const jwtHelper = require("../helpers/jwt.helper");
const otpHelper = require("../helpers/otp.helper");

exports.sendOTP = async (phoneNumber) => {
  let user = await User.findOne({ phone_number: phoneNumber });
  if (!user) user = await User.create({ phone_number: phoneNumber });
  const otp = await otpHelper.generateOTP(phoneNumber);
  return otp;
};
exports.verifyOTP = async (phoneNumber, otp) => {
  let user = await User.findOne({ phone_number: phoneNumber });

  if (!user) throw new Error("User dosent exist");

  await otpHelper.verifyOTP(phoneNumber, otp);
  const accessToken = jwtHelper.generateAccessToken(user._id);
  const refreshToken = jwtHelper.generateRefreshToken(user._id);
  return {
    user,
    token: {
      accessToken,
      refreshToken,
    },
  };
};
exports.refreshToken = async (refreshToken) => {
  if (!refreshToken)
    return { success: false, message: "Refresh token required" };

  const payload = jwtHelper.verifyRefreshToken(refreshToken);
  if (!payload)
    return { success: false, message: "Invalid or expired refresh token" };

  const newAccessToken = jwtHelper.generateAccessToken(payload.id);
  return { accessToken: newAccessToken };
};
