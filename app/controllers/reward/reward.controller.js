const walletService = require('../../services/reward/wallet.service');
const referralService = require('../../services/reward/referral.service');
const rewardService = require('../../services/reward/reward.service');
const RewardRule = require('../../models/reward/rewardRule.model');
const ApiResponse = require('../../utils/apiResponse');

exports.getRules = async (req, res) => {
    const rules = await RewardRule.find({ is_deleted: false, is_active: true });
    res.status(200).json(new ApiResponse(true, 'Reward rules', rules));
};

exports.getWallet = async (req, res) => {
    const wallet = await walletService.getWallet(req.user._id);
    res.status(200).json(new ApiResponse(true, 'Wallet details', wallet));
};

exports.generateReferral = async (req, res) => {
    const code = req.user._id;
    // In a real app, this would be a deep link like: https://naka.app/link?ref=${code}
    // Deep linking depends on frontend/platform configuration (Firebase Dynamic Links, Branch.io, etc.)
    // We will simulate a standard web link format.
    const shareLink = `https://naka.com/register?ref=${code}`;
    const message = `Hey! I found this amazing app for jobs. Use my referral code ${code} or click here: ${shareLink}`;

    res.status(200).json(new ApiResponse(true, 'Referral generated', {
        code,
        shareLink,
        message
    }));
};

exports.recordVisit = async (req, res) => {
    const { duration } = req.body; // seconds
    // This is called by the "Referee" (the new user)

    const referral = await referralService.updateVisitTime(req.user._id, duration);
    if (referral && referral.status === 'successful') {
        // Trigger generic reward check for the REFERRER
        await rewardService.checkAndRewardReferral(referral.referrer_id);
    }

    res.status(200).json(new ApiResponse(true, 'Visit recorded'));
};

// Admin: Create Rule
exports.createRule = async (req, res) => {
    const rule = await RewardRule.create(req.body);
    res.status(201).json(new ApiResponse(true, 'Rule created', rule));
};
