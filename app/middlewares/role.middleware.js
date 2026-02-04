const RolePermission = require('../models/rolePermission.model');

// Check if user has the required role
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role (${req.user.role}) is not allowed to access this resource`
            });
        }
        next();
    };
};

// Start of dynamic permission check (Can be expanded)
exports.checkPermission = (moduleName, action) => {
    return async (req, res, next) => {
        try {
            // Admin always has access
            if (req.user.role === 'admin') return next();

            const permission = await RolePermission.findOne({ role: req.user.role });

            if (!permission) {
                return res.status(403).json({ message: 'No permissions found for this role' });
            }

            const modulePerm = permission.permissions.find(p => p.module === moduleName);

            if (modulePerm && modulePerm.actions.includes(action)) {
                return next();
            }

            return res.status(403).json({ message: 'Permission denied' });
        } catch (error) {
            return res.status(500).json({ message: 'Permission check failed' });
        }
    };
};
