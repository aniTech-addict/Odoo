import express from 'express';
import {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    changePassword,
    getUserStats
} from '../Controller/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Get current user profile (self or admin)
router.get('/profile/:id', getUser);

// Admin routes
router.get('/', authorizeRoles('admin'), getUsers);
router.get('/admin/stats', authorizeRoles('admin'), getUserStats);
router.put('/:id', authorizeRoles('admin'), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);

// Self or admin routes
router.put('/profile/:id/password', changePassword);

export default router;