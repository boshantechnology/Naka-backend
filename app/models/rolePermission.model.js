const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['admin', 'user', 'worker', 'support'],
        required: true,
        unique: true
    },
    permissions: [{
        module: { type: String, required: true }, // e.g., 'job', 'user', 'chat'
        actions: [{ type: String }] // e.g., ['create', 'read', 'update', 'delete']
    }]
}, { timestamps: true });

module.exports = mongoose.model('RolePermission', rolePermissionSchema);
