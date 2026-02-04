const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        job_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobCategory',
            required: true,
        },
        title: { // Mapped to job_name
            type: String,
            required: true,
            trim: true,
        },
        description: { // Mapped to job_description
            type: String,
            required: true,
        },
        // Requirements fields
        experience_required: { type: String }, // e.g. "1-2 Years"
        salary_amount: { type: Number },
        salary_type: {
            type: String,
            enum: ['per_day', 'monthly'],
            default: 'monthly'
        },
        vacancy_start_date: { type: Date },
        vacancy_end_date: { type: Date },
        total_required_workers: { type: Number, default: 1 },
        benefits: { type: String },

        // Stats
        applicants_count: { type: Number, default: 0 },
        click_count: { type: Number, default: 0 },
        views: { type: Number, default: 0 }, // keeping views as alias for click_count if needed

        // Location (GeoJSON)
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0]
            },
            address: { type: String } // Human readable
        },

        // Status
        is_active: { type: Boolean, default: true },

        // Legacy fields specific to current codebase
        employment_type: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Freelance'],
            default: 'Full-time',
        },
        work_mode: {
            type: String,
            enum: ['On-site', 'Remote', 'Hybrid'],
            default: 'On-site',
        },
        company_name: { type: String },
        company_logo: { type: String, default: null },
    },
    { timestamps: true }
);

// Index for geospatial queries
jobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', jobSchema);
