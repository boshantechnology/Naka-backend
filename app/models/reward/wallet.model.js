const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    total_earned: { type: Number, default: 0 },
    available_balance: { type: Number, default: 0 }, // Cash
    locked_balance: { type: Number, default: 0 },

    // Credit Balances (for Contractors)
    free_labour_credits: { type: Number, default: 0 },
    free_job_post_credits: { type: Number, default: 0 },

    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
