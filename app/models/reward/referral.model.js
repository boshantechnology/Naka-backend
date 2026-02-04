const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrer_id: { // Who shared
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referee_id: { // Who installed
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    code: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'successful'],
        default: 'pending'
    },
    visit_duration_seconds: { type: Number, default: 0 },
    is_rewarded: { type: Boolean, default: false },

    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
