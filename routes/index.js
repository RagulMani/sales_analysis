const express = require('express');
const router = express.Router();

const analysisRoutes = require('./analysis');
const dataRefreshRoutes = require('./dataRefresh');
const { getSystemLogs } = require('../controllers/logs');

// API routes
router.use('/analysis', analysisRoutes);
router.use('/refresh', dataRefreshRoutes);

// System logs route
router.get('/logs', getSystemLogs);

module.exports = router;