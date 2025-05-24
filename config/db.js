const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017'; // Use 127.0.0.1 instead of localhost
const dbName = process.env.DB_NAME || 'sales_analysis';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    try {
        const client = new MongoClient(mongoUri);

        // For MongoDB driver v4.0.0+ (no need for deprecated options)
        await client.connect();

        const db = client.db(dbName);

        // Cache the connection
        cachedClient = client;
        cachedDb = db;

        console.log('Successfully connected to MongoDB');
        return { client, db };
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

module.exports = { connectToDatabase };