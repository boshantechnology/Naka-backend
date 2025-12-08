const jobService = require('../../services/job/job.service');
const ApiResponse = require('../../utils/apiResponse');

exports.createJobPost = async (req, res) => {
    const job = await jobService.createJobPost(req);
    res.status(200).json(new ApiResponse(true, "Job posted successfully", job));
};

exports.getJobDetail = async (req, res) => {
    const result = await jobService.getJobDetail(req.params.id, req.user._id);
    res.status(200).json(new ApiResponse(true, "Job detail fetched successfully", result));
};

exports.getJobList = async (req, res) => {
    const { search, tags, page, limit } = req.query;

    const userLocation = req.query.latitude && req.query.longitude
        ? { latitude: parseFloat(req.query.latitude), longitude: parseFloat(req.query.longitude) }
        : null;

    const result = await jobService.getJobList({
        search,
        tags: tags ? tags.split(",") : [],
        userLocation,
        radiusInKm: parseInt(req.query.radiusInKm) || 5,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
    });

    res.status(200).json(new ApiResponse(true, "Job list fetched successfully", result));
};

exports.getMyJobPosts = async (req, res) => {
    const result = await jobService.getMyJobPosts(req.user._id, req.query.page, req.query.limit);
    res.status(200).json(new ApiResponse(true, "My job posts fetched successfully", result));
}

exports.applyJob = async (req, res) => {
    const { job_id } = req.body;
    const result = await jobService.applyJob(job_id, req.user);
    res.status(200).json(new ApiResponse(true, "Job applied successfully", result));
};

// JOB CATEGORY CONTROLLERS
exports.createJobCategory = async (req, res) => {
    const category = await jobService.createJobCategory(req.body);
    res.status(200).json(new ApiResponse(true, "Job category created successfully", category));
};

exports.getJobCategories = async (req, res) => {
    const categories = await jobService.getJobCategories(req.query.limit, req.query.page);
    res.status(200).json(new ApiResponse(true, "Job categories fetched successfully", categories));
};

exports.deleteJobCategory = async (req, res) => {
    await jobService.deleteJobCategory(req.params.id);
    res.status(200).json(new ApiResponse(true, "Job category deleted successfully"));
};

exports.updateJobCategory = async (req, res) => {
    const category = await jobService.updateJobCategory(req.params.id, req.body);
    res.status(200).json(new ApiResponse(true, "Job category updated successfully", category));
}

// RECOMMENDED JOBS
exports.getRecommendedJobs = async (req, res) => {
    const result = await jobService.getRecommendedJobs(req.user._id, req.query.page, req.query.limit);
    res.status(200).json(new ApiResponse(true, "Recommended jobs fetched successfully", result));
}