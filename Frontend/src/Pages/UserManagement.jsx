import React, { useState } from 'react';

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

// --- Main Component ---

export default function UserManagementPage() {
    const [users] = useState([
        { id: 1, name: 'Marc', role: 'Manager', manager: 'Sarah', email: 'marc@example.com' },
        { id: 2, name: 'Adept Mandrill', role: 'Employee', manager: 'Marc', email: 'adept.m@example.com' },
        { id: 3, name: 'Delightful Dragonfly', role: 'Employee', manager: 'Marc', email: 'delightful.d@example.com' },
        { id: 4, name: 'Attractive Fly', role: 'Employee', manager: 'Sarah', email: 'attractive.f@example.com' },
        { id: 5, name: 'Incomparable Crocodile', role: 'Admin', manager: 'CEO', email: 'incomparable.c@example.com' },
    ]);

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
                                {users.map((user) => (
                                    <tr key={user.id} className="bg-white border-b border-slate-200/80 hover:bg-slate-50/70 transition-colors duration-150">
                                        <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.manager}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="flex items-center mx-auto font-semibold text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-4 py-2 transition-all duration-200 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">
                                                <MailIcon />
                                                Send Password
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {/* Footer / Pagination */}
                    <footer className="flex justify-between items-center p-4 bg-slate-50/50 border-t border-slate-200">
                         <span className="text-sm text-slate-500">Showing 1 to 5 of 15 users</span>
                         <div className="flex items-center gap-2">
                            <button className="px-3 py-1 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100">Previous</button>
                            <button className="px-3 py-1 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100">Next</button>
                         </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
