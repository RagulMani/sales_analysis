const { loadData } = require('./dataLoader');
const RefreshLog = require('../models/refreshLog');
const path = require('path');
const { logger } = require('../utils/logger');

class DataRefreshService {
    constructor() {
        this.logFile = path.join(__dirname, '../../logs/refresh.log');
    }

    async refreshData(options = {}) {
        const { filePath, strategy = 'append' } = options;
        const startTime = new Date();
        let status = 'success';
        let message = 'Refresh completed successfully';

        try {
            const csvFilePath = filePath || path.join(__dirname, '../../data/sales.csv');

            if (strategy === 'overwrite') {
                await this.clearExistingData();
            }

            await loadData(csvFilePath);
        } catch (err) {
            status = 'failed';
            message = `Refresh failed: ${err.message}`;
            logger.error(message);
            throw err;
        } finally {
            await this.logRefresh({
                timestamp: startTime,
                duration: new Date() - startTime,
                status,
                message,
                strategy
            });
        }
    }

    async clearExistingData() {
        const { db } = await connectToDatabase();
        await db.collection('orders').deleteMany({});
        await db.collection('products').deleteMany({});
        await db.collection('customers').deleteMany({});
    }

    async logRefresh(entry) {
        try {
            await RefreshLog.create(entry);
            const logEntry = `${new Date().toISOString()} | ${entry.status} | ${entry.duration}ms | ${entry.strategy} | ${entry.message}\n`;
            fs.appendFileSync(this.logFile, logEntry, 'utf8');
        } catch (err) {
            logger.error(`Failed to log refresh: ${err.message}`);
        }
    }

    async getRefreshLogs() {
        try {
            return await RefreshLog.getRecent();
        } catch (err) {
            logger.error(`Failed to get refresh logs: ${err.message}`);
            return [];
        }
    }
}

module.exports = new DataRefreshService();