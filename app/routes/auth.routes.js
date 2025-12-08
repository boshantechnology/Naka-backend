const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const validator = require('../middlewares/validation/auth/authValidation.middleware');
const { optionalUpload, uploadProfileImage } = require('../utils/fileUpload');

router.post('/send-otp', validator.validateUserNumber, asyncHandler(authController.sendOTP))
    .post('/verify-OTP', validator.validateOtpVerification, asyncHandler(authController.verifyOTP))
    .post('/refresh-token', validator.validateToken, asyncHandler(authController.refreshToken))
    .post('/logout', protect, asyncHandler(authController.logout))
    .get('/me', protect, asyncHandler(userController.getProfile))
    .get('/all', protect, authorizeRoles('admin'), asyncHandler(userController.getAllUsers))
    .post('/work-setup-profile', protect, validator.validateWorkerProfileSetup, optionalUpload(uploadProfileImage.single('profile_image')), asyncHandler(userController.setupWorkerProfile))
    .post('/recruiter-setup-profile', protect, validator.validateRecruiterProfileSetup, asyncHandler(userController.setupRecruiterProfile))

module.exports = router;
