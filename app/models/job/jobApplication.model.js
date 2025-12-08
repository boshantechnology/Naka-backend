const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
    {
        job_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cover_letter: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ['Applied', 'Shortlisted', 'Rejected', 'Interview Scheduled', 'Hired'],
            default: 'Applied',
        },
        applied_at: {
            type: Date,
            default: Date.now,
        },
        message: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
