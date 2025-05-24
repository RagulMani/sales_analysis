const { connectToDatabase } = require('../config/db');

class Product {
  static async createOrUpdate(productData) {
    const { db } = await connectToDatabase();
    return db.collection('products').updateOne(
      { productId: productData.productId },
      { $set: productData },
      { upsert: true }
    );
  }

  static async findByCategory(category) {
    const { db } = await connectToDatabase();
    return db.collection('products').find({ category }).toArray();
  }
}

module.exports = Product;