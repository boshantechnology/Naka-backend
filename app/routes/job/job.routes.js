const express = require('express');
const router = express.Router();
const jobController = require('../../controllers/job/job.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/role.middleware');
const asyncHandler = require('../../middlewares/asyncHandler.middleware');
const validator = require('../../middlewares/validation/job/jobValidation.middleware');

/**
 * @swagger
 * /job/create-job:
 *   post:
 *     summary: Create a new job post
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post('/create-job', protect, authorizeRoles("user"), validator.validateJob, asyncHandler(jobController.createJobPost))
    /**
     * @swagger
     * /job/job/{id}:
     *   get:
     *     summary: Get job details by ID
     *     tags: [Job]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Job ID
     *     responses:
     *       200:
     *         description: Job details
     */
    .get('/job/:id', protect, authorizeRoles("user"), validator.validateJobId, asyncHandler(jobController.getJobDetail))
    /**
     * @swagger
     * /job/jobs:
     *   get:
     *     summary: Get list of jobs
     *     tags: [Job]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of jobs
     */
    .get('/jobs', protect, authorizeRoles("user", "admin"), asyncHandler(jobController.getJobList))
    /**
     * @swagger
     * /job/my-jobs:
     *   get:
     *     summary: Get jobs posted by current user
     *     tags: [Job]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of my jobs
     */
    .get('/my-jobs', protect, authorizeRoles("user"), asyncHandler(jobController.getMyJobPosts))
    /**
     * @swagger
     * /job/apply:
     *   post:
     *     summary: Apply for a job
     *     tags: [Job]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - jobId
     *             properties:
     *               jobId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Applied successfully
     */
    .post('/apply', protect, authorizeRoles("user", "admin"), validator.validateJobId, asyncHandler(jobController.applyJob))

    // JOB CATEGORY ROUTES
    /**
     * @swagger
     * /job/create-category:
     *   post:
     *     summary: Create a new job category
     *     tags: [Job Category]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       201:
     *         description: Category created successfully
     */
    .post('/create-category', protect, authorizeRoles("admin"), validator.validateJobCategory, asyncHandler(jobController.createJobCategory))
    /**
     * @swagger
     * /job/categories:
     *   get:
     *     summary: Get all job categories
     *     tags: [Job Category]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of categories
     */
    .get('/categories', protect, authorizeRoles("user", "admin"), asyncHandler(jobController.getJobCategories))
    /**
     * @swagger
     * /job/category/{id}:
     *   delete:
     *     summary: Delete a job category
     *     tags: [Job Category]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Category deleted successfully
     */
    .delete('/category/:id', protect, authorizeRoles("admin"), validator.validateJobCategoryId, asyncHandler(jobController.deleteJobCategory)) 
    /**
     * @swagger
     * /job/category/{id}:
     *   patch:
     *     summary: Update a job category
     *     tags: [Job Category]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       200:
     *         description: Category updated successfully
     */
    .patch('/category/:id', protect, authorizeRoles("admin"), validator.validateJobCategoryId, asyncHandler(jobController.updateJobCategory))

    // RECOMMENDED JOBS
    /**
     * @swagger
     * /job/recommended-jobs:
     *   get:
     *     summary: Get recommended jobs for user
     *     tags: [Job]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of recommended jobs
     */
    .get('/recommended-jobs', protect, authorizeRoles("user"), asyncHandler(jobController.getRecommendedJobs))

module.exports = router;
