const express = require('express');
const router = express.Router();
const rewardController = require('../../controllers/reward/reward.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/role.middleware');
const asyncHandler = require('../../middlewares/asyncHandler.middleware');

// Public/Auth
/**
 * @swagger
 * /rewards/rules:
 *   get:
 *     summary: Get all active reward rules
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reward rules
 */
router.get('/rules', protect, asyncHandler(rewardController.getRules));

// Worker
/**
 * @swagger
 * /rewards/worker/wallet:
 *   get:
 *     summary: Get worker wallet details
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet details for worker
 */
router.get('/worker/wallet', protect, authorizeRoles('worker'), asyncHandler(rewardController.getWallet));
/**
 * @swagger
 * /rewards/referral/visit:
 *   post:
 *     summary: Record a visit for referral tracking
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duration
 *             properties:
 *               duration:
 *                 type: number
 *                 description: Visit duration in seconds
 *     responses:
 *       200:
 *         description: Visit recorded
 */
router.post('/referral/visit', protect, authorizeRoles('worker'), asyncHandler(rewardController.recordVisit));

// User (Contractor)
/**
 * @swagger
 * /rewards/user/wallet:
 *   get:
 *     summary: Get contractor wallet details
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet details for contractor
 */
router.get('/user/wallet', protect, authorizeRoles('user'), asyncHandler(rewardController.getWallet));

// Common Referral
/**
 * @swagger
 * /rewards/referral/generate:
 *   post:
 *     summary: Generate referral code and share link
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral code and share message
 */
router.post('/referral/generate', protect, asyncHandler(rewardController.generateReferral));

// Admin
/**
 * @swagger
 * /rewards/rules:
 *   post:
 *     summary: Create a new reward rule
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - action_type
 *               - min_count
 *               - reward_type
 *               - reward_value
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [worker, user]
 *               action_type:
 *                 type: string
 *                 enum: [referral_success, job_completed, good_review, job_posted, verified_worker_hired]
 *               min_count:
 *                 type: number
 *               reward_type:
 *                 type: string
 *                 enum: [cash, free_labour, free_job_post, discount]
 *               reward_value:
 *                 type: number
 *     responses:
 *       201:
 *         description: Rule created successfully
 */
router.post('/rules', protect, authorizeRoles('admin'), asyncHandler(rewardController.createRule));

module.exports = router;
