const User = require("../models/user.model");
const jwtHelper = require("../helpers/jwt.helper");
const otpHelper = require("../helpers/otp.helper");
const referralService = require("./reward/referral.service");

exports.sendOTP = async (phoneNumber) => {
  let user = await User.findOne({ phone_number: phoneNumber });
  if (!user) {
    // New user registration flow trigger, but we just want to send OTP
    // We don't necessarily create user here if we want strict registration
    // But preserving existing logic:
    user = await User.create({ phone_number: phoneNumber });
  }
  const otp = await otpHelper.generateOTP(phoneNumber);
  return otp;
};



exports.verifyOTP = async (phoneNumber, otp, referralCode) => {
  let user = await User.findOne({ phone_number: phoneNumber });

  if (!user) throw new Error("User does not exist");

  await otpHelper.verifyOTP(phoneNumber, otp);

  // Register referral if provided and NOT already processed (simplistic check: newly created user check?)
  // Since we created user in sendOTP, we might miss "new user" context. 
  // Ideally, sendOTP shouldn't create User. But strictly following existing logic:
  // We can try to register referral. Logic in referral service will prevent duplicates.
  if (referralCode) {
    try {
      // Assuming referralCode is the referrer's UserID as per previous step
      await referralService.registerReferral(referralCode, user._id);
    } catch (e) {
      console.log("Referral error (ignoring):", e.message);
    }
  }

  // Refresh token rotation or generation
  const accessToken = jwtHelper.generateAccessToken(user._id, user.role); // Added role to token
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

  const user = await User.findById(payload.id);
  if (!user) return { success: false, message: "User not found" };

  const newAccessToken = jwtHelper.generateAccessToken(user._id, user.role);
  return { accessToken: newAccessToken };
};
