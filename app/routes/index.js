const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes')
const jobRoutes = require('./job/job.routes')

router.use('/auth', authRoutes);
router.use('/job', jobRoutes);
router.use('/chat', require('./chat.routes'));
router.use('/events', require('./event/event.routes'));
router.use('/rewards', require('./reward/reward.routes'));

module.exports = router;
