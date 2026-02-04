const mongoose = require('mongoose');

const jobCompletionSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contractor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completed_at: { type: Date, default: Date.now },
    is_verified: { type: Boolean, default: false }, // verified by contractor

    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('JobCompletion', jobCompletionSchema);
