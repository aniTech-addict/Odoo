import Expense from '../db/Expense.js';
import Category from '../db/Category.js';
import { authenticateToken, authorizeResourceOwner } from '../middleware/auth.js';

// Get all expenses for the authenticated user
export const getExpenses = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            category,
            sortBy = 'submittedAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { owner: req.user.userId };

        if (status) filter.status = status;
        if (category) filter.category = category;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const expenses = await Expense.find(filter)
            .populate('category', 'name description')
            .populate('approvedBy', 'username email')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Expense.countDocuments(filter);

        res.status(200).json({
            expenses,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalExpenses: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({ message: 'Server error while fetching expenses.' });
    }
};

// Get single expense by ID
export const getExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id)
            .populate('category', 'name description')
            .populate('approvedBy', 'username email')
            .populate('owner', 'username email');

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        // Check if user owns the expense or is admin
        if (expense.owner._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.status(200).json({ expense });

    } catch (error) {
        console.error('Get expense error:', error);
        res.status(500).json({ message: 'Server error while fetching expense.' });
    }
};

// Create new expense
export const createExpense = async (req, res) => {
    try {
        const { subject, description, amount, currency, category, tags } = req.body;

        // Validate required fields
        if (!subject || !amount || !category) {
            return res.status(400).json({ message: 'Subject, amount, and category are required.' });
        }

        // Verify category exists and is active
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc || !categoryDoc.isActive) {
            return res.status(400).json({ message: 'Invalid or inactive category.' });
        }

        const newExpense = new Expense({
            subject,
            description,
            amount,
            currency: currency || 'USD',
            category,
            owner: req.user.userId,
            tags: tags || []
        });

        const savedExpense = await newExpense.save();

        // Populate the saved expense for response
        await savedExpense.populate('category', 'name description');

        res.status(201).json({
            message: 'Expense created successfully!',
            expense: savedExpense
        });

    } catch (error) {
        console.error('Create expense error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating expense.' });
    }
};

// Update expense
export const updateExpense = async (req, res) => {
    try {
        const { subject, description, amount, currency, category, tags, status } = req.body;

        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        // Check if user owns the expense or is admin
        if (expense.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Only allow status update for admins and approvers
        if (status && status !== expense.status) {
            if (req.user.role !== 'admin' && req.user.role !== 'editor') {
                return res.status(403).json({ message: 'Insufficient permissions to update status.' });
            }
        }

        // Update fields
        if (subject) expense.subject = subject;
        if (description !== undefined) expense.description = description;
        if (amount) expense.amount = amount;
        if (currency) expense.currency = currency;
        if (category) {
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc || !categoryDoc.isActive) {
                return res.status(400).json({ message: 'Invalid or inactive category.' });
            }
            expense.category = category;
        }
        if (tags) expense.tags = tags;
        if (status) expense.status = status;

        const updatedExpense = await expense.save();
        await updatedExpense.populate('category', 'name description');

        res.status(200).json({
            message: 'Expense updated successfully!',
            expense: updatedExpense
        });

    } catch (error) {
        console.error('Update expense error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating expense.' });
    }
};

// Delete expense
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        // Check if user owns the expense or is admin
        if (expense.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Only allow deletion of draft expenses by owners
        if (expense.owner.toString() === req.user.userId && expense.status !== 'Draft') {
            return res.status(400).json({ message: 'Cannot delete submitted or approved expenses.' });
        }

        await Expense.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Expense deleted successfully!' });

    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ message: 'Server error while deleting expense.' });
    }
};

// Submit expense for approval
export const submitExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        // Check if user owns the expense
        if (expense.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Check if expense is in draft status
        if (expense.status !== 'Draft') {
            return res.status(400).json({ message: 'Only draft expenses can be submitted.' });
        }

        await expense.submitForApproval();
        await expense.populate('category', 'name description');

        res.status(200).json({
            message: 'Expense submitted for approval successfully!',
            expense
        });

    } catch (error) {
        console.error('Submit expense error:', error);
        res.status(500).json({ message: 'Server error while submitting expense.' });
    }
};

// Get expense statistics for the authenticated user
export const getExpenseStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const stats = await Expense.aggregate([
            { $match: { owner: userId } },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    avgAmount: { $avg: '$amount' },
                    statusBreakdown: {
                        $push: '$status'
                    },
                    categoryBreakdown: {
                        $push: '$category'
                    }
                }
            }
        ]);

        // Calculate status counts
        const statusCounts = stats[0]?.statusBreakdown.reduce((acc, status) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {}) || {};

        res.status(200).json({
            totalExpenses: stats[0]?.totalExpenses || 0,
            totalAmount: stats[0]?.totalAmount || 0,
            averageAmount: stats[0]?.avgAmount || 0,
            statusBreakdown: statusCounts
        });

    } catch (error) {
        console.error('Get expense stats error:', error);
        res.status(500).json({ message: 'Server error while fetching statistics.' });
    }
};