import jwt from 'jsonwebtoken';
import User from '../db/User.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access token required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = decoded;
        req.userDoc = user; // Full user document for convenience
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        }
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

// Middleware to check if user has required role
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions.' });
        }

        next();
    };
};

// Middleware to check if user owns the resource or is admin
export const authorizeResourceOwner = (resourceUserIdField = 'owner') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        // Admin can access any resource
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user owns the resource
        const resourceUserId = req.body[resourceUserIdField] || req.params.userId || req.user.userId;

        if (req.user.userId !== resourceUserId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        next();
    };
};