exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log('User Role:', req.user.role, roles); // Debugging line`
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role (${req.user.role}) not allowed to access this resource` });
        }
        next();
    };
};
