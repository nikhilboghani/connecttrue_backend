// Not Found Middleware
const notfound= (req, res, next) => {
    res.status(404)
        .json({ message: 'Route not found' });

};

// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
};

module.exports = {
    notfound,
    errorHandler
};
