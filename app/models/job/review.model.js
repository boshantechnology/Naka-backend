const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },

    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
