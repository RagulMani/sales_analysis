const express = require('express');
const router = express.Router();
const {
  refreshData,
  getRefreshLogs
} = require('../controllers/dataRefresh');
const { validateRefreshRequest } = require('../utils/validators');

// Data refresh routes
router.post('/', validateRefreshRequest, refreshData);
router.get('/logs', getRefreshLogs);

module.exports = router;