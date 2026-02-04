const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const asyncHandler = require('../middlewares/asyncHandler.middleware');
const validator = require('../middlewares/validation/auth/authValidation.middleware');
const { optionalUpload, uploadProfileImage } = require('../utils/fileUpload');

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to user mobile number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid phone number
 */
router.post('/send-otp', validator.validateUserNumber, asyncHandler(authController.sendOTP))
    /**
     * @swagger
     * /auth/verify-OTP:
     *   post:
     *     summary: Verify OTP
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - phoneNumber
     *               - otp
     *             properties:
     *               phoneNumber:
     *                 type: string
     *               otp:
     *                 type: string
     *     responses:
     *       200:
     *         description: OTP verified successfully
     *       400:
     *         description: Invalid OTP
     */
    .post('/verify-OTP', validator.validateOtpVerification, asyncHandler(authController.verifyOTP))
    /**
     * @swagger
     * /auth/refresh-token:
     *   post:
     *     summary: Refresh access token
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: Token refreshed successfully
     */
    .post('/refresh-token', validator.validateToken, asyncHandler(authController.refreshToken))
    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: Logout user
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Logged out successfully
     */
    .post('/logout', protect, asyncHandler(authController.logout))
    /**
     * @swagger
     * /auth/me:
     *   get:
     *     summary: Get current user profile
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile
     */
    .get('/me', protect, asyncHandler(userController.getProfile))
    /**
     * @swagger
     * /auth/all:
     *   get:
     *     summary: Get all users (Admin only)
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of users
     */
    .get('/all', protect, authorizeRoles('admin'), asyncHandler(userController.getAllUsers))
    /**
     * @swagger
     * /auth/work-setup-profile:
     *   post:
     *     summary: Setup worker profile
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               profile_image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Profile setup successfully
     */
    .post('/work-setup-profile', protect, validator.validateWorkerProfileSetup, optionalUpload(uploadProfileImage.single('profile_image')), asyncHandler(userController.setupWorkerProfile))
    /**
     * @swagger
     * /auth/recruiter-setup-profile:
     *   post:
     *     summary: Setup recruiter profile
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Profile setup successfully
     */
    .post('/recruiter-setup-profile', protect, validator.validateRecruiterProfileSetup, asyncHandler(userController.setupRecruiterProfile))

module.exports = router;
