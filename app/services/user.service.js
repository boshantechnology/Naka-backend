const User = require('../models/user.model');

exports.getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
};

exports.getAllUsers = async () => {
    const users = await User.find().select('-password');
    return users;
};

exports.setupWorkerProfile = async (userId, profileData, file) => {
    if (file) {
        profileData.profile_image = file.path;
    }
    const user = await User.findByIdAndUpdate(userId, profileData, { new: true, runValidators: true }).select('-password');
    if (!user) throw new Error("User not found");
    return user;
};

exports.setupRecruiterProfile = async (userId, profileData) => {
    const user = await User.findByIdAndUpdate(userId, profileData, { new: true, runValidators: true }).select('-password');
    if (!user) throw new Error("User not found");
    return user;
}