const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: [
            'JOB_OPPORTUNITY',
            'FAMILY_PLANNING',
            'SKILL_UPGRADE',
            'FINANCIAL_GUIDANCE',
            'GOVERNMENT_SCHEME',
            'GENERAL_AWARENESS'
        ],
        required: true
    },
    banner_image: { type: String },
    location: { type: String, required: true },
    event_mode: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },
    event_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    speakers: [{ type: String }],
    benefits: [{ type: String }],
    eligibility: { type: String },
    max_participants: { type: Number },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null }
}, { timestamps: true });

// Indexes for performance
eventSchema.index({ event_date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ is_deleted: 1 });

module.exports = mongoose.model('Event', eventSchema);
