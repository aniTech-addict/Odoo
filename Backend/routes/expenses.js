import express from 'express';
import {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    submitExpense,
    getExpenseStats
} from '../Controller/expenseController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All expense routes require authentication
router.use(authenticateToken);

// Expense CRUD routes
router.get('/', getExpenses);
router.get('/stats', getExpenseStats);
router.get('/:id', getExpense);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

// Expense actions
router.post('/:id/submit', submitExpense);

export default router;