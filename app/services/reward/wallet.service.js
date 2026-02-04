const Wallet = require('../../models/reward/wallet.model');
const RewardTransaction = require('../../models/reward/rewardTransaction.model');

exports.getWallet = async (userId) => {
    let wallet = await Wallet.findOne({ user_id: userId, is_deleted: false });
    if (!wallet) {
        wallet = await Wallet.create({ user_id: userId });
    }
    return wallet;
};

// Internal use: credit funds/benefits
exports.creditWallet = async (userId, amount, type, description, ruleId = null, rewardType = 'cash') => {
    let wallet = await exports.getWallet(userId);

    // Create Transaction
    await RewardTransaction.create({
        wallet_id: wallet._id,
        user_id: userId,
        amount,
        type: 'credit',
        reward_type: rewardType,
        rule_id: ruleId,
        description
    });

    // Update Balance
    if (rewardType === 'cash') {
        wallet.available_balance += amount;
        wallet.total_earned += amount;
    } else if (rewardType === 'free_labour') {
        wallet.free_labour_credits += amount;
    } else if (rewardType === 'free_job_post') {
        wallet.free_job_post_credits += amount;
    }

    await wallet.save();
    return wallet;
};
