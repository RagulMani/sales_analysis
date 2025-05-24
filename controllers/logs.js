const DataRefreshService = require('../services/dataRefresh');

async function getSystemLogs(req, res) {
    try {
        const logs = await DataRefreshService.getRefreshLogs();
        res.json({
            success: true,
            logs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve system logs',
            error: err.message
        });
    }
}

module.exports = {
    getSystemLogs
};