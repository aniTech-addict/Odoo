import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

// --- Helper Components (for cleaner code) ---

// Icon components for better readability
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-500">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-500">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// Component for the status pills
const StatusPill = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
    const statusClasses = {
        Approved: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Rejected: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

// --- Main Component ---

export default function Approvals() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State for approvals data
    const [approvals, setApprovals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    // Load approvals data
    useEffect(() => {
        loadApprovals();
    }, [currentPage]);

    const loadApprovals = async () => {
        try {
            setIsLoading(true);
            setError('');

            const params = {
                page: currentPage,
                limit: 10
            };

            const response = await apiService.approvals.getPending(params);
            setApprovals(response.approvals || []);
            setPagination(response.pagination || {});
        } catch (error) {
            console.error('Failed to load approvals:', error);
            setError('Failed to load approvals. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprovalAction = async (approvalId, action, comments = '') => {
        try {
            setActionLoading(approvalId);

            if (action === 'approve') {
                await apiService.approvals.approve(approvalId, comments);
            } else if (action === 'reject') {
                await apiService.approvals.reject(approvalId, comments);
            }

            // Reload approvals after action
            await loadApprovals();
            alert(`Expense ${action}d successfully!`);
        } catch (error) {
            console.error(`Failed to ${action} approval:`, error);
            alert(`Failed to ${action} expense. Please try again.`);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBEB] font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Approvals to review</h1>
                    <div className="mt-4 sm:mt-0 flex items-center gap-3 bg-white/60 border border-slate-200/80 rounded-full px-4 py-2 shadow-sm">
                        <UserIcon />
                        <span className="font-semibold text-slate-700">Maurya Shah</span>
                        <ChevronDownIcon />
                    </div>
                </header>

                {/* Main Content Card */}
                <main className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
                    {/* Table Container */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium">Approval Subject</th>
                                    <th scope="col" className="px-6 py-4 font-medium">Request Owner</th>
                                    <th scope="col" className="px-6 py-4 font-medium">Category</th>
                                    <th scope="col" className="px-6 py-4 font-medium">Status</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-right">Total Amount</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                                                <span className="text-slate-600">Loading approvals...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : approvals.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center">
                                            <div className="text-slate-500">
                                                <p className="text-lg mb-2">No pending approvals</p>
                                                <p className="text-sm">All caught up! 🎉</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    approvals.map((approval) => (
                                        <tr key={approval._id} className="bg-white border-b border-slate-200/80 hover:bg-slate-50/70 transition-colors duration-150">
                                            <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                                {approval.expense?.subject || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {approval.requestedBy?.username || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {approval.expense?.category?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusPill status="Pending" />
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-slate-900 whitespace-nowrap">
                                                {approval.expense?.amount ? (
                                                    <>
                                                        {approval.expense.amount.toFixed(2)}
                                                        <span className="ml-1 text-xs text-slate-400">
                                                            ({approval.expense.currency || 'USD'})
                                                        </span>
                                                    </>
                                                ) : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleApprovalAction(approval._id, 'approve')}
                                                        disabled={actionLoading === approval._id}
                                                        className="font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 rounded-lg px-3 py-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                                                    >
                                                        {actionLoading === approval._id ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <>
                                                                <CheckIcon />
                                                                Approve
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprovalAction(approval._id, 'reject')}
                                                        disabled={actionLoading === approval._id}
                                                        className="font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-lg px-3 py-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                                                    >
                                                        {actionLoading === approval._id ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <>
                                                                <XIcon />
                                                                Reject
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Footer / Pagination */}
                    {!isLoading && approvals.length > 0 && (
                        <footer className="flex justify-between items-center p-4 bg-slate-50/50 border-t border-slate-200">
                            <span className="text-sm text-slate-500">
                                Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalApprovals)} of {pagination.totalApprovals} results
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={!pagination.hasPrevPage}
                                    className="px-3 py-1 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={!pagination.hasNextPage}
                                    className="px-3 py-1 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </footer>
                    )}
                </main>
            </div>
        </div>
    );
}


