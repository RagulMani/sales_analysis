const { connectToDatabase } = require('../config/db');

class RefreshLog {
    static async create(logEntry) {
        const { db } = await connectToDatabase();
        return db.collection('refreshLogs').insertOne({
            ...logEntry,
            timestamp: new Date()
        });
    }

    static async getRecent(limit = 50) {
        const { db } = await connectToDatabase();
        return db.collection('refreshLogs')
            .find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();
    }
}

module.exports = RefreshLog;