const express = require('express');
const router = express.Router();
const jobController = require('../../controllers/job/job.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/role.middleware');
const asyncHandler = require('../../middlewares/asyncHandler.middleware');
const validator = require('../../middlewares/validation/job/jobValidation.middleware');

router.post('/create-job', protect, authorizeRoles("user"), validator.validateJob, asyncHandler(jobController.createJobPost))
    .get('/job/:id', protect, authorizeRoles("user"), validator.validateJobId, asyncHandler(jobController.getJobDetail))
    .get('/jobs', protect, authorizeRoles("user", "admin"), asyncHandler(jobController.getJobList))
    .get('/my-jobs', protect, authorizeRoles("user"), asyncHandler(jobController.getMyJobPosts))
    .post('/apply', protect, authorizeRoles("user", "admin"), validator.validateJobId, asyncHandler(jobController.applyJob))

    // JOB CATEGORY ROUTES
    .post('/create-category', protect, authorizeRoles("admin"), validator.validateJobCategory, asyncHandler(jobController.createJobCategory))
    .get('/categories', protect, authorizeRoles("user", "admin"), asyncHandler(jobController.getJobCategories))
    .delete('/category/:id', protect, authorizeRoles("admin"), validator.validateJobCategoryId, asyncHandler(jobController.deleteJobCategory)) 
    .patch('/category/:id', protect, authorizeRoles("admin"), validator.validateJobCategoryId, asyncHandler(jobController.updateJobCategory))

    // RECOMMENDED JOBS
    .get('/recommended-jobs', protect, authorizeRoles("user"), asyncHandler(jobController.getRecommendedJobs))

module.exports = router;
