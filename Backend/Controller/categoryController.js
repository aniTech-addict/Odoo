import Category from '../db/Category.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

// Get all active categories
export const getCategories = async (req, res) => {
    try {
        const { includeInactive = 'false' } = req.query;

        const filter = includeInactive === 'true' ? {} : { isActive: true };

        const categories = await Category.find(filter)
            .populate('createdBy', 'username email')
            .sort({ name: 1 });

        res.status(200).json({ categories });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error while fetching categories.' });
    }
};

// Get single category by ID
export const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.status(200).json({ category });

    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ message: 'Server error while fetching category.' });
    }
};

// Create new category (admin/editor only)
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Category name is required.' });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(409).json({ message: 'Category already exists.' });
        }

        const newCategory = new Category({
            name: name.trim(),
            description: description ? description.trim() : '',
            createdBy: req.user.userId
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            message: 'Category created successfully!',
            category: savedCategory
        });

    } catch (error) {
        console.error('Create category error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating category.' });
    }
};

// Update category (admin/editor only)
export const updateCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Check if new name conflicts with existing category
        if (name && name.trim() !== category.name) {
            const existingCategory = await Category.findOne({ name: name.trim() });
            if (existingCategory) {
                return res.status(409).json({ message: 'Category name already exists.' });
            }
            category.name = name.trim();
        }

        if (description !== undefined) {
            category.description = description.trim();
        }

        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        const updatedCategory = await category.save();

        res.status(200).json({
            message: 'Category updated successfully!',
            category: updatedCategory
        });

    } catch (error) {
        console.error('Update category error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating category.' });
    }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Check if category is being used by any expenses
        const Expense = (await import('../db/Expense.js')).default;
        const expenseCount = await Expense.countDocuments({ category: req.params.id });

        if (expenseCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete category that is being used by expenses. Deactivate it instead.'
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Category deleted successfully!' });

    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Server error while deleting category.' });
    }
};

// Seed default categories (admin only)
export const seedDefaultCategories = async (req, res) => {
    try {
        const defaultCategories = [
            { name: 'Office Supplies', description: 'Office supplies and materials' },
            { name: 'Marketing', description: 'Marketing and advertising expenses' },
            { name: 'Food', description: 'Food and beverage expenses' },
            { name: 'IT', description: 'Information technology expenses' },
            { name: 'Team Building', description: 'Team building and events' },
            { name: 'Travel', description: 'Travel and accommodation expenses' },
            { name: 'Training', description: 'Training and development expenses' },
            { name: 'Equipment', description: 'Equipment and hardware purchases' }
        ];

        let createdCount = 0;

        for (const catData of defaultCategories) {
            const existingCategory = await Category.findOne({ name: catData.name });
            if (!existingCategory) {
                const newCategory = new Category({
                    ...catData,
                    createdBy: req.user.userId
                });
                await newCategory.save();
                createdCount++;
            }
        }

        res.status(200).json({
            message: `${createdCount} default categories created successfully!`
        });

    } catch (error) {
        console.error('Seed categories error:', error);
        res.status(500).json({ message: 'Server error while seeding categories.' });
    }
};