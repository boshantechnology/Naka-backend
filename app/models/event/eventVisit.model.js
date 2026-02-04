const mongoose = require('mongoose');

const eventVisitSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visited_at: { type: Date, default: Date.now }
}, { timestamps: true });

eventVisitSchema.index({ event_id: 1, worker_id: 1 }, { unique: true });

module.exports = mongoose.model('EventVisit', eventVisitSchema);
