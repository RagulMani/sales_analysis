const { connectToDatabase } = require('../config/db');

class Order {
  static async createOrUpdate(orderData) {
    const { db } = await connectToDatabase();
    return db.collection('orders').updateOne(
      { orderId: orderData.orderId },
      { $set: orderData },
      { upsert: true }
    );
  }

  static async findByDateRange(startDate, endDate) {
    const { db } = await connectToDatabase();
    const query = {};

    if (startDate || endDate) {
      query.dateOfSale = {};
      if (startDate) query.dateOfSale.$gte = new Date(startDate);
      if (endDate) query.dateOfSale.$lte = new Date(endDate);
    }

    return db.collection('orders').find(query).toArray();
  }
}

module.exports = Order;