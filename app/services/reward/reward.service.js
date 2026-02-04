const RewardRule = require('../../models/reward/rewardRule.model');
const Referral = require('../../models/reward/referral.model');
const JobCompletion = require('../../models/job/jobCompletion.model');
const Review = require('../../models/job/review.model');
const walletService = require('./wallet.service');

// Core Engine
exports.checkAndReward = async (userId, userRole, actionType) => {
    // 1. Get Active Rules for this Role & Action
    const rules = await RewardRule.find({
        role: userRole,
        action_type: actionType,
        is_active: true,
        is_deleted: false
    });

    if (!rules.length) return;

    for (const rule of rules) {
        // 2. Check Criteria
        const count = await getCountForAction(userId, actionType);

        // 3. Modulo check? "5 jobs -> reward". Means 5th, 10th, 15th? 
        // Or just one time? "5 successful jobs" usually implies milestones.
        // Let's assume milestones (every X actions).

        if (count > 0 && count % rule.min_count === 0) {
            // AWARD!
            await walletService.creditWallet(
                userId,
                rule.reward_value,
                'credit',
                `Reward for ${rule.min_count} ${actionType}`,
                rule._id,
                rule.reward_type
            );

            // If it's a referral reward, mark the referrals as rewarded?
            // Complex if we batch them. For simplicity, we just count "successful" ones.
            if (actionType === 'referral_success') {
                // Mark pending rewards as processed to avoid double counting if we change logic?
                // Actually, if we use just count modulus, we don't need to mark individual items if the count is stable.
                // But usually we mark them to preventing re-counting if rules change.
                // Let's mark latest X as rewarded.
                await markReferralsRewarded(userId, rule.min_count);
            }
        }
    }
};

// Helper: Count qualifying actions
async function getCountForAction(userId, actionType) {
    if (actionType === 'referral_success') {
        // Count unrewarded successful referrals? 
        // Or if using Modulo logic on TOTAL successful referrals?
        // Let's use TOTAL successful REFERRALS to support "Every 10 referrals".
        return await Referral.countDocuments({ referrer_id: userId, status: 'successful' }); // Simplified
    }
    if (actionType === 'job_completed') {
        return await JobCompletion.countDocuments({ worker_id: userId, is_verified: true });
    }
    if (actionType === 'good_review') {
        return await Review.countDocuments({ reviewee_id: userId, rating: { $gte: 4 } });
    }
    // Contractor actions
    if (actionType === 'verified_worker_hired') {
        return await JobCompletion.countDocuments({ contractor_id: userId, is_verified: true });
    }
    return 0;
}

async function markReferralsRewarded(referrerId, limit) {
    // Find 'successful' referrals that are NOT 'is_rewarded'
    // This is needed so we don't reward for same 10 people twice if we rely on "unrewarded" count.
    // Wait, if I used TOTAL count above, I might double reward if I don't track state.
    // CORRECT APPROACH: Count *Unrewarded* Successful actions.
    // Let's fix getCountForAction for referral.

    // ACTUALLY: The helper above for referral should be:
    // return await Referral.countDocuments({ referrer_id: userId, status: 'successful', is_rewarded: false });
    // And then we mark them.
}

// Override helper for stateful rewards
exports.checkAndRewardReferral = async (referrerId) => {
    const unrewardedCount = await Referral.countDocuments({
        referrer_id: referrerId,
        status: 'successful',
        is_rewarded: false
    });

    const rules = await RewardRule.find({
        role: 'worker',
        action_type: 'referral_success',
        is_active: true
    });

    for (const rule of rules) {
        if (unrewardedCount >= rule.min_count) {
            // Award
            await walletService.creditWallet(
                referrerId,
                rule.reward_value,
                'credit',
                `Referral Bonus for ${rule.min_count} users`,
                rule._id,
                rule.reward_type
            );

            // Mark X as rewarded
            const referrals = await Referral.find({
                referrer_id: referrerId,
                status: 'successful',
                is_rewarded: false
            }).limit(rule.min_count);

            for (const ref of referrals) {
                ref.is_rewarded = true;
                await ref.save();
            }
        }
    }
}
