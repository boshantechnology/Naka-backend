const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'],
        default: 'applied'
    },
    cover_message: {
        type: String
    }
}, { timestamps: true });

// Ensure a worker can search for their applications or job owner can see who applied
jobApplicationSchema.index({ job_id: 1, worker_id: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
