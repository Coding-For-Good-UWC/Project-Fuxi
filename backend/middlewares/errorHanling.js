const errorHandling = (err, _, res, __) => {
    console.error(err.stack);
    res.status(500).json({
        status: responseStatus.error,
        message: "Server error",
    });
}

module.exports = errorHandling