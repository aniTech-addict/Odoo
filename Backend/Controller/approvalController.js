import Approval from '../db/Approval.js';
import Expense from '../db/Expense.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

// Get pending approvals for the authenticated user
export const getPendingApprovals = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            priority,
            sortBy = 'dueDate',
            sortOrder = 'asc'
        } = req.query;

        // Build filter object
        const filter = { approver: req.user.userId, status: 'Pending' };

        if (priority) filter.priority = priority;

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const approvals = await Approval.find(filter)
            .populate('expense')
            .populate('requestedBy', 'username email')
            .populate('delegatedTo', 'username email')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Approval.countDocuments(filter);

        res.status(200).json({
            approvals,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalApprovals: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get pending approvals error:', error);
        res.status(500).json({ message: 'Server error while fetching approvals.' });
    }
};

// Get approval by ID
export const getApproval = async (req, res) => {
    try {
        const approval = await Approval.findById(req.params.id)
            .populate('expense')
            .populate('requestedBy', 'username email')
            .populate('approver', 'username email')
            .populate('delegatedTo', 'username email')
            .populate('reviewedBy', 'username email');

        if (!approval) {
            return res.status(404).json({ message: 'Approval not found.' });
        }

        // Check if user is the approver or admin
        if (approval.approver._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.status(200).json({ approval });

    } catch (error) {
        console.error('Get approval error:', error);
        res.status(500).json({ message: 'Server error while fetching approval.' });
    }
};

// Approve an expense
export const approveExpense = async (req, res) => {
    try {
        const { comments } = req.body;

        const approval = await Approval.findById(req.params.id);

        if (!approval) {
            return res.status(404).json({ message: 'Approval not found.' });
        }

        // Check if user is the approver or admin
        if (approval.approver._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Check if approval is still pending
        if (approval.status !== 'Pending') {
            return res.status(400).json({ message: 'Approval has already been processed.' });
        }

        // Update approval
        await approval.approve(comments);

        // Update expense status
        const expense = await Expense.findById(approval.expense);
        if (expense) {
            await expense.approve(req.user.userId, comments);
        }

        res.status(200).json({
            message: 'Expense approved successfully!',
            approval,
            expense
        });

    } catch (error) {
        console.error('Approve expense error:', error);
        res.status(500).json({ message: 'Server error while approving expense.' });
    }
};

// Reject an expense
export const rejectExpense = async (req, res) => {
    try {
        const { comments } = req.body;

        if (!comments || !comments.trim()) {
            return res.status(400).json({ message: 'Rejection reason is required.' });
        }

        const approval = await Approval.findById(req.params.id);

        if (!approval) {
            return res.status(404).json({ message: 'Approval not found.' });
        }

        // Check if user is the approver or admin
        if (approval.approver._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Check if approval is still pending
        if (approval.status !== 'Pending') {
            return res.status(400).json({ message: 'Approval has already been processed.' });
        }

        // Update approval
        await approval.reject(comments);

        // Update expense status
        const expense = await Expense.findById(approval.expense);
        if (expense) {
            await expense.reject(comments);
        }

        res.status(200).json({
            message: 'Expense rejected successfully!',
            approval,
            expense
        });

    } catch (error) {
        console.error('Reject expense error:', error);
        res.status(500).json({ message: 'Server error while rejecting expense.' });
    }
};

// Delegate approval to another user
export const delegateApproval = async (req, res) => {
    try {
        const { delegateTo, reason } = req.body;

        if (!delegateTo) {
            return res.status(400).json({ message: 'Delegate user ID is required.' });
        }

        if (!reason || !reason.trim()) {
            return res.status(400).json({ message: 'Delegation reason is required.' });
        }

        const approval = await Approval.findById(req.params.id);

        if (!approval) {
            return res.status(404).json({ message: 'Approval not found.' });
        }

        // Check if user is the approver or admin
        if (approval.approver._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        // Check if approval is still pending
        if (approval.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot delegate processed approval.' });
        }

        await approval.delegate(delegateTo, reason);

        res.status(200).json({
            message: 'Approval delegated successfully!',
            approval
        });

    } catch (error) {
        console.error('Delegate approval error:', error);
        res.status(500).json({ message: 'Server error while delegating approval.' });
    }
};

// Get approval statistics for the authenticated user
export const getApprovalStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const stats = await Approval.aggregate([
            { $match: { approver: userId } },
            {
                $group: {
                    _id: null,
                    totalApprovals: { $sum: 1 },
                    pendingCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
                    },
                    approvedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
                    },
                    rejectedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
                    },
                    overdueCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$status', 'Pending'] },
                                        { $lt: ['$dueDate', new Date()] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalApprovals: 0,
            pendingCount: 0,
            approvedCount: 0,
            rejectedCount: 0,
            overdueCount: 0
        };

        res.status(200).json(result);

    } catch (error) {
        console.error('Get approval stats error:', error);
        res.status(500).json({ message: 'Server error while fetching approval statistics.' });
    }
};

// Get overdue approvals for admin
export const getOverdueApprovals = async (req, res) => {
    try {
        const overdueApprovals = await Approval.findOverdue()
            .populate('expense')
            .populate('requestedBy', 'username email')
            .populate('approver', 'username email')
            .sort({ dueDate: 1 });

        res.status(200).json({ approvals: overdueApprovals });

    } catch (error) {
        console.error('Get overdue approvals error:', error);
        res.status(500).json({ message: 'Server error while fetching overdue approvals.' });
    }
};