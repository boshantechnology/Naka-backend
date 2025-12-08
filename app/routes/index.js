const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes')
const jobRoutes = require('./job/job.routes')

router.use('/auth', authRoutes);
router.use('/job', jobRoutes);

module.exports = router;
