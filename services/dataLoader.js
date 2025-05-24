const { MongoClient } = require('mongodb');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const logger = {
    info: (msg) => console.log(new Date().toISOString(), '[INFO]:', msg),
    debug: (msg) => console.log(new Date().toISOString(), '[DEBUG]:', msg),
    error: (msg) => console.error(new Date().toISOString(), '[ERROR]:', msg),
};

async function loadData(csvFilePath) {
    const uri = 'mongodb://localhost:27017';
    const dbName = 'sales_analysis';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        logger.info(`Connected to database: ${dbName}`);

        const collections = await db.listCollections().toArray();
        logger.info(`Collections: ${collections.map(c => c.name).join(', ')}`);

        const rows = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (data) => rows.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        logger.info(`CSV file read completed. Rows count: ${rows.length}`);
        let processedCount = 0;

        for (const row of rows) {
            const customerId = row['Customer ID'].trim();
            const productId = row['Product ID'].trim();
            const orderId = row['Order ID'].trim();

            // 1. Upsert customer
            await db.collection('customers').updateOne(
                { customerId },
                {
                    $set: {
                        name: row['Customer Name'].trim(),
                        email: row['Customer Email'].trim(),
                        address: row['Customer Address'].trim(),
                        region: row['Region'].trim(),
                        customerId,
                    },
                },
                { upsert: true }
            );

            // 2. Upsert product
            await db.collection('products').updateOne(
                { productId },
                {
                    $set: {
                        name: row['Product Name'].trim(),
                        category: row['Category'].trim(),
                        basePrice: parseFloat(row['Unit Price']),
                        productId,
                    },
                },
                { upsert: true }
            );

            // 3. Add/Update order
            const existingOrder = await db.collection('orders').findOne({ orderId });

            const item = {
                productId,
                productName: row['Product Name'].trim(),
                category: row['Category'].trim(),
                quantity: parseInt(row['Quantity Sold']),
                unitPrice: parseFloat(row['Unit Price']),
                discount: parseFloat(row['Discount']),
            };

            if (existingOrder) {
                await db.collection('orders').updateOne(
                    { orderId },
                    { $push: { items: item } }
                );
            } else {
                await db.collection('orders').insertOne({
                    orderId,
                    customerId,
                    dateOfSale: new Date(row['Date of Sale']),
                    paymentMethod: row['Payment Method'].trim(),
                    shippingCost: parseFloat(row['Shipping Cost']),
                    totalDiscount: parseFloat(row['Discount']),
                    items: [item],
                });
            }

            logger.debug(`Processed order ${orderId}`);
            processedCount++;
        }

        logger.info(`Processed ${processedCount} records`);

        // Show sample documents
        const sampleCustomer = await db.collection('customers').findOne({});
        const sampleProduct = await db.collection('products').findOne({});
        const sampleOrder = await db.collection('orders').findOne({});
        logger.info('Final counts:\n  - Customers: ' +
            (await db.collection('customers').countDocuments()) +
            `\n  - Products: ${(await db.collection('products').countDocuments())}` +
            `\n  - Orders: ${(await db.collection('orders').countDocuments())}`);
        logger.info('Sample verification results:');
        logger.info(`Customer: ${JSON.stringify(sampleCustomer)}`);
        logger.info(`Product: ${JSON.stringify(sampleProduct)}`);
        logger.info(`Order: ${JSON.stringify(sampleOrder)}`);
    } catch (err) {
        logger.error(`LOAD FAILED: ${err.message}`);
    } finally {
        await client.close();
        logger.info('Connection closed');
        logger.info('=== DATA LOAD COMPLETE ===');
    }
}

(async () => {
    logger.info('=== STARTING DATA LOAD ===');
    await loadData(path.join(__dirname, '../data/sales.csv'));
})();
