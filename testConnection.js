const { connectToDatabase } = require('./config/db');

async function testConnection() {
  try {
    const { db } = await connectToDatabase();
    console.log('Connection successful!');
    
    // Test a simple query
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
}

testConnection();