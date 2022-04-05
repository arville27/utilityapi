module.exports = {
    logging(req, _, next) {
        console.log(
            `[${new Date().toLocaleString()}] ${req.protocol.toUpperCase()} ${req.httpVersion} ${
                req.method
            } ${req.originalUrl}`
        );
        next();
    },
};
