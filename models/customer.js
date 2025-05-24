const { connectToDatabase } = require('../config/db');

class Customer {
  static async createOrUpdate(customerData) {
    const {db} = await connectToDatabase();
    return db.collection('customers').updateOne(
      { customerId: customerData.customerId },
      { $set: customerData },
      { upsert: true }
    );
  }

  static async findByRegion(region) {
    const {db} = await connectToDatabase();
    return db.collection('customers').find({ region }).toArray();
  }
}

module.exports = Customer;