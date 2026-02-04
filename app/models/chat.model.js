const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: false // Optional, can be direct chat or job-context chat
    },
    last_message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
