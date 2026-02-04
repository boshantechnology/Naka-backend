const mongoose = require('mongoose');

const rewardRuleSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['worker', 'user'],
        required: true
    },
    action_type: {
        type: String,
        enum: ['referral_success', 'job_completed', 'good_review', 'job_posted', 'verified_worker_hired'],
        required: true
    },
    min_count: {
        type: Number,
        default: 1,
        required: true
    },
    reward_type: {
        type: String,
        enum: ['cash', 'free_labour', 'free_job_post', 'discount'],
        required: true
    },
    reward_value: {
        type: Number,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('RewardRule', rewardRuleSchema);
