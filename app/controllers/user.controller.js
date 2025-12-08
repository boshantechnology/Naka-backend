const userService = require('../services/user.service');
const ApiResponse = require('../utils/apiResponse');

exports.getProfile = async (req, res) => {
    const user = await userService.getUserProfile(req.user._id);
    res.status(200).json(new ApiResponse(true, "User profile fetched", user));
};

exports.getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(new ApiResponse(true, "All users", users));
};

exports.setupWorkerProfile = async (req, res) => {
    const user = await userService.setupWorkerProfile(req.user._id, req.body, req.file);
    res.status(200).json(new ApiResponse(true, "Profile setup successfully", user));
}

exports.setupRecruiterProfile = async (req, res) => {
    const user = await userService.setupRecruiterProfile(req.user._id, req.body);
    res.status(200).json(new ApiResponse(true, "Recruiter profile setup successfully", user));
}
