const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], default: 'present' },

    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
