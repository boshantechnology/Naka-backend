const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/event/event.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { authorizeRoles } = require('../../middlewares/role.middleware');
const asyncHandler = require('../../middlewares/asyncHandler.middleware');

// Public/Auth routes
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all active events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [JOB_OPPORTUNITY, FAMILY_PLANNING, SKILL_UPGRADE, FINANCIAL_GUIDANCE, GOVERNMENT_SCHEME, GENERAL_AWARENESS]
 *         description: Filter by event type
 *     responses:
 *       200:
 *         description: List of active events
 */
router.get('/', protect, asyncHandler(eventController.getAllEvents));
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get('/:id', protect, asyncHandler(eventController.getEventById));

// Worker specific
/**
 * @swagger
 * /events/{id}/visit:
 *   post:
 *     summary: Record worker visit to an event
 *     tags: [Events]
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
 *         description: Visit recorded successfully
 */
router.post('/:id/visit', protect, asyncHandler(eventController.recordVisit));

// Admin routes
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - location
 *               - event_mode
 *               - event_date
 *               - start_time
 *               - end_time
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [JOB_OPPORTUNITY, FAMILY_PLANNING, SKILL_UPGRADE, FINANCIAL_GUIDANCE, GOVERNMENT_SCHEME, GENERAL_AWARENESS]
 *               banner_image:
 *                 type: string
 *               location:
 *                 type: string
 *               event_mode:
 *                 type: string
 *                 enum: [online, offline]
 *               event_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               speakers:
 *                 type: array
 *                 items:
 *                   type: string
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               eligibility:
 *                 type: string
 *               max_participants:
 *                 type: number
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/', protect, authorizeRoles('admin'), asyncHandler(eventController.createEvent));
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
router.put('/:id', protect, authorizeRoles('admin'), asyncHandler(eventController.updateEvent));
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Soft delete an event
 *     tags: [Events]
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
 *         description: Event deleted successfully
 */
router.delete('/:id', protect, authorizeRoles('admin'), asyncHandler(eventController.deleteEvent));

module.exports = router;
