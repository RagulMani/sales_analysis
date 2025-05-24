function validateDateRange(req, res, next) {
    const { startDate, endDate } = req.query;

    if (startDate && isNaN(new Date(startDate))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid start date format. Use YYYY-MM-DD'
        });
    }

    if (endDate && isNaN(new Date(endDate))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid end date format. Use YYYY-MM-DD'
        });
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
            success: false,
            message: 'Start date must be before end date'
        });
    }

    next();
}

function validateRefreshRequest(req, res, next) {
    const { strategy } = req.body;

    if (strategy && !['overwrite', 'append'].includes(strategy)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid strategy. Use either "overwrite" or "append"'
        });
    }

    next();
}

module.exports = {
    validateDateRange,
    validateRefreshRequest
};