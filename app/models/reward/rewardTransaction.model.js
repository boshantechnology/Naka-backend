const mongoose = require('mongoose');

const rewardTransactionSchema = new mongoose.Schema({
    wallet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rule_id: { // Nullable if manual adjustment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RewardRule'
    },
    amount: { type: Number, required: true }, // Value of reward
    type: { // credit (earned), debit (withdrawn/used)
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    reward_type: { // mirrors rule type
        type: String,
        enum: ['cash', 'free_labour', 'free_job_post', 'discount'],
        default: 'cash'
    },
    description: { type: String },

    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('RewardTransaction', rewardTransactionSchema);
