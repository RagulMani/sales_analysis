require('dotenv').config();
const { loadData } = require('../services/dataLoader');
const path = require('path');
const { logger } = require('../utils/logger');

async function main() {
    try {
        const csvFilePath = path.join(__dirname, '../data/sales.csv');
        logger.info('Starting data loading process...');
        await loadData(csvFilePath);
        logger.info('Data loading completed successfully');
        process.exit(0);
    } catch (err) {
        logger.error(`Data loading failed: ${err.message}`);
        process.exit(1);
    }
}

main();