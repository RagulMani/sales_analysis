const express = require('express');
const router = express.Router();
const {
  getTotalRevenue,
  getRevenueByCategory
} = require('../controllers/analysis');
const { validateDateRange } = require('../utils/validators');

// Revenue analysis routes
router.get('/revenue/total', validateDateRange, getTotalRevenue);
router.get('/revenue/by-category', validateDateRange, getRevenueByCategory);

// Product analysis routes
router.get('/products/top', validateDateRange);

module.exports = router;