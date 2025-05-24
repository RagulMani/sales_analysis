const { connectToDatabase } = require('../config/db');

async function getTotalRevenue(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const { db } = await connectToDatabase();

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.dateOfSale = {};
            if (startDate) matchStage.dateOfSale.$gte = new Date(startDate);
            if (endDate) matchStage.dateOfSale.$lte = new Date(endDate);
        }

        const result = await db.collection('orders').aggregate([
            { $match: matchStage },
            { $unwind: '$items' },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                '$items.quantity',
                                { $subtract: ['$items.unitPrice', '$items.discount'] }
                            ]
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        res.json({
            success: true,
            totalRevenue: result[0]?.totalRevenue || 0,
            count: result[0]?.count || 0,
            currency: 'USD',
            dateRange: { startDate, endDate }
        });
    } catch (err) {
        console.error('Error in getTotalRevenue:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate total revenue',
            error: err.message
        });
    }
}

async function getRevenueByCategory(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const { db } = await connectToDatabase();

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.dateOfSale = {};
            if (startDate) matchStage.dateOfSale.$gte = new Date(startDate);
            if (endDate) matchStage.dateOfSale.$lte = new Date(endDate);
        }

        const result = await db.collection('orders').aggregate([
            { $match: matchStage },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: 'productId',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                '$items.quantity',
                                { $subtract: ['$items.unitPrice', '$items.discount'] }
                            ]
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ]).toArray();

        res.json({
            success: true,
            results: result,
            currency: 'USD',
            dateRange: { startDate, endDate }
        });
    } catch (err) {
        console.error('Error in getRevenueByCategory:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate revenue by category',
            error: err.message
        });
    }
}

module.exports = {
    getTotalRevenue,
    getRevenueByCategory
};