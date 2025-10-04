import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

// --- Helper Icon Components ---

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

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-1">
        <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

// --- Main Component ---

export default function UserManagementPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    // Load users data
    useEffect(() => {
        loadUsers();
    }, [currentPage, searchTerm, roleFilter]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setError('');

            const params = {
                page: currentPage,
                limit: 10,
                search: searchTerm || undefined,
                role: roleFilter || undefined
            };

            const response = await apiService.users.getAll(params);
            setUsers(response.users || []);
            setPagination(response.pagination || {});
        } catch (error) {
            console.error('Failed to load users:', error);
            setError('Failed to load users. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendPasswordReset = async (userEmail) => {
        try {
            await apiService.auth.forgotPassword(userEmail);
            alert('Password reset email sent successfully!');
        } catch (error) {
            console.error('Failed to send password reset:', error);
            alert('Failed to send password reset email. Please try again.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                setActionLoading(userId);
                await apiService.users.delete(userId);
                await loadUsers(); // Reload the list
                alert('User deleted successfully!');
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Failed to delete user. Please try again.');
            } finally {
                setActionLoading(null);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBEB] font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                    <div className="mt-4 sm:mt-0 flex items-center gap-4">
                         <button className="flex items-center justify-center font-bold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg px-4 py-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
                            <PlusIcon />
                            New User
                        </button>
                        <div className="flex items-center gap-3 bg-white/60 border border-slate-200/80 rounded-full px-4 py-2 shadow-sm">
                            <UserIcon />
                            <span className="font-semibold text-slate-700">Maurya Shah</span>
                            <ChevronDownIcon />
                        </div>
                    </div>
                </header>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg border-4 border-gray-900 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none"
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="user">User</option>
                        </select>

                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setRoleFilter('');
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Main Content Card */}
                <main className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium">User</th>
                                    <th scope="col" className="px-6 py-4 font-medium">Role</th>
                                    <th scope="col" className="px-6 py-4 font-medium">Manager</th>
                                    <th scope="col" className="px-6 py-4 font-medium">Email</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                                                <span className="text-slate-600">Loading users...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center">
                                            <div className="text-red-600">
                                                <p className="text-lg mb-2">Error loading users</p>
                                                <p className="text-sm">{error}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center">
                                            <div className="text-slate-500">
                                                <p className="text-lg mb-2">No users found</p>
                                                <p className="text-sm">Try adjusting your search or filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((userItem) => (
                                        <tr key={userItem._id} className="bg-white border-b border-slate-200/80 hover:bg-slate-50/70 transition-colors duration-150">
                                            <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                                {userItem.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    userItem.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {userItem.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {userItem.lastLogin ? new Date(userItem.lastLogin).toLocaleDateString() : 'Never'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{userItem.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleSendPasswordReset(userItem.email)}
                                                        className="flex items-center font-semibold text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3 py-1 transition-all duration-200 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
                                                    >
                                                        <MailIcon />
                                                        Reset PW
                                                    </button>
                                                    <button className="p-1 text-slate-400 hover:text-slate-600">
                                                        <EditIcon />
                                                    </button>
                                                    {userItem._id !== user?._id && (
                                                        <button
                                                            onClick={() => handleDeleteUser(userItem._id)}
                                                            disabled={actionLoading === userItem._id}
                                                            className="p-1 text-red-400 hover:text-red-600 disabled:opacity-50"
                                                        >
                                                            {actionLoading === userItem._id ? (
                                                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <TrashIcon />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                     {/* Footer / Pagination */}
                     {!isLoading && users.length > 0 && (
                         <footer className="flex justify-between items-center p-4 bg-slate-50/50 border-t border-slate-200">
                              <span className="text-sm text-slate-500">
                                  Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
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
