import express from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    seedDefaultCategories
} from '../Controller/categoryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public routes (authenticated users can view categories)
router.get('/', authenticateToken, getCategories);
router.get('/:id', authenticateToken, getCategory);

// Protected routes (only admin/editor can modify)
router.post('/', authenticateToken, authorizeRoles('admin', 'editor'), createCategory);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'editor'), updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteCategory);
router.post('/seed-defaults', authenticateToken, authorizeRoles('admin'), seedDefaultCategories);

export default router;