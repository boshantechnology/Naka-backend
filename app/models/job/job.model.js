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
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
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
        company_name: {
            type: String,
            required: true,
        },
        company_logo: {
            type: String,
            default: null
        },
        industry: {
            type: String,
        },
        website: {
            type: String,
        },
        location: {
            city: String,
            state: String,
            country: String,
            pincode: String,
            lattitude: String,
            longitude: String
        },
        salary_range: {
            min: { type: Number },
            max: { type: Number },
            currency: { type: String, default: 'INR' },
            period: { type: String, enum: ['Hourly', 'Daily', 'Monthly', 'Yearly'], default: 'Yearly' },
            negotiable: { type: Boolean, default: false },
        },
        skill_required: [
            {
                type: String,
            },
        ],
        experience_level: {
            type: String,
            enum: ['Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead'],
        },
        education: {
            type: String,
        },
        deadline: {
            type: Date,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        recruiter_name: {
            type: String
        },
        recruiter_designation: {
            type: String
        },
        recruiter_phone: {
            type: String
        },
        recruiter_email: {
            type: String
        },
        views: {
            type: Number,
            default: 0,
        },
        tags: [
            {
                type: String,
            },
        ],
        featured: {
            type: Boolean,
            default: false
        },
        priority: {
            type: Number,
            default: 0
        },
        chat_enabled: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
