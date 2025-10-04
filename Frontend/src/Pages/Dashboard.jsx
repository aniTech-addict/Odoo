import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import {
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    Users,
    FileText,
    Settings,
    LogOut
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        expenseStats: { totalExpenses: 0, totalAmount: 0, averageAmount: 0 },
        approvalStats: { totalApprovals: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 }
    });
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);

            // Load expense statistics
            const expenseStats = await apiService.expenses.getStats();
            setStats(prev => ({ ...prev, expenseStats }));

            // Load recent expenses
            const expensesResponse = await apiService.expenses.getAll({ limit: 5, sortBy: 'submittedAt', sortOrder: 'desc' });
            setRecentExpenses(expensesResponse.expenses || []);

            // Load approval statistics (if user has approval permissions)
            if (user?.role === 'admin' || user?.role === 'editor') {
                const approvalStats = await apiService.approvals.getStats();
                setStats(prev => ({ ...prev, approvalStats }));

                // Load pending approvals
                const approvalsResponse = await apiService.approvals.getPending({ limit: 5 });
                setPendingApprovals(approvalsResponse.approvals || []);
            }

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Approved': 'text-green-600 bg-green-100',
            'Pending': 'text-yellow-600 bg-yellow-100',
            'Rejected': 'text-red-600 bg-red-100',
            'Draft': 'text-gray-600 bg-gray-100',
            'Submitted': 'text-blue-600 bg-blue-100'
        };
        return colors[status] || 'text-gray-600 bg-gray-100';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b-4 border-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-gray-900" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Expense Dashboard</h1>
                                <p className="text-gray-600">Welcome back, {user?.username}!</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                                <Plus className="w-4 h-4 inline mr-2" />
                                New Expense
                            </button>
                            <button
                                onClick={logout}
                                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                            >
                                <LogOut className="w-4 h-4 inline mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-gray-900">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.expenseStats.totalExpenses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-gray-900">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.expenseStats.totalAmount)}</p>
                            </div>
                        </div>
                    </div>

                    {user?.role !== 'user' && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-gray-900">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.approvalStats.pendingCount}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-gray-900">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avg. Amount</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.expenseStats.averageAmount)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Expenses */}
                    <div className="bg-white rounded-2xl shadow-lg border-4 border-gray-900">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
                        </div>
                        <div className="p-6">
                            {recentExpenses.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No expenses found</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentExpenses.map((expense) => (
                                        <div key={expense._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-gray-900">{expense.subject}</p>
                                                <p className="text-sm text-gray-600">{expense.category?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(expense.status)}`}>
                                                    {expense.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pending Approvals (for managers/admins) */}
                    {user?.role !== 'user' && (
                        <div className="bg-white rounded-2xl shadow-lg border-4 border-gray-900">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
                            </div>
                            <div className="p-6">
                                {pendingApprovals.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No pending approvals</p>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingApprovals.map((approval) => (
                                            <div key={approval._id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{approval.expense?.subject}</p>
                                                    <p className="text-sm text-gray-600">by {approval.requestedBy?.username}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">
                                                        {formatCurrency(approval.expense?.amount)}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Due: {new Date(approval.dueDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg border-4 border-gray-900">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="flex items-center justify-center p-4 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Expense
                            </button>

                            {user?.role !== 'user' && (
                                <button className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Review Approvals
                                </button>
                            )}

                            {user?.role === 'admin' && (
                                <button className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                                    <Users className="w-5 h-5 mr-2" />
                                    Manage Users
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;