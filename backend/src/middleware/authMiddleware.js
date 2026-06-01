const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access denied. Token has expired.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Access denied. Invalid token structure.' });
        }
        return res.status(401).json({ message: 'Access denied. Token verification failed.' });
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Access denied. Authentication required first.' });
    }

    if (req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({ message: 'Access denied. Administrative privileges required.' });
};

module.exports = {
    verifyToken,
    verifyAdmin
};
