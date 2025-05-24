const { loadData } = require('../services/dataLoader');
const DataRefreshService = require('../services/dataRefresh');
const path = require('path');

async function refreshData(req, res) {
    try {
        const { filePath, strategy } = req.body;
        const csvFilePath = filePath || path.join(__dirname, '../../data/sales.csv');

        await loadData(csvFilePath);
        await DataRefreshService.logRefresh({
            status: 'success',
            message: 'Data refresh completed',
            strategy: strategy || 'default'
        });

        res.json({
            success: true,
            message: 'Data refresh completed successfully'
        });
    } catch (err) {
        await DataRefreshService.logRefresh({
            status: 'failed',
            message: err.message,
            strategy: req.body.strategy || 'default'
        });

        res.status(500).json({
            success: false,
            message: 'Data refresh failed',
            error: err.message
        });
    }
}

async function getRefreshLogs(req, res) {
    try {
        const logs = await getRefreshLogs();
        res.json({
            success: true,
            logs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve refresh logs',
            error: err.message
        });
    }
}

module.exports = {
    refreshData,
    getRefreshLogs
};