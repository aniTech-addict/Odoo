import express from 'express';
import {
    getPendingApprovals,
    getApproval,
    approveExpense,
    rejectExpense,
    delegateApproval,
    getApprovalStats,
    getOverdueApprovals
} from '../Controller/approvalController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All approval routes require authentication
router.use(authenticateToken);

// Get pending approvals for current user
router.get('/pending', getPendingApprovals);
router.get('/stats', getApprovalStats);
router.get('/:id', getApproval);

// Approval actions
router.post('/:id/approve', approveExpense);
router.post('/:id/reject', rejectExpense);
router.post('/:id/delegate', delegateApproval);

// Admin routes
router.get('/admin/overdue', authorizeRoles('admin'), getOverdueApprovals);

export default router;