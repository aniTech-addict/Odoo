import React, { useState } from 'react';

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

// --- Main App Component ---

export default function App() {
    // Dummy data to populate the approvals table
    const [approvals] = useState([
        { id: 1, subject: 'Office Supplies Q4', owner: 'Sarah Johnson', category: 'Office Mgmt', status: 'Approved', amount: 567.00, currency: 'USD' },
        { id: 2, subject: 'Marketing Campaign Launch', owner: 'Alex Rodriguez', category: 'Marketing', status: 'Pending', amount: 1250.50, currency: 'USD' },
        { id: 3, subject: 'Client Dinner at "The Grill"', owner: 'Emily White', category: 'Food', status: 'Pending', amount: 320.75, currency: 'USD' },
        { id: 4, subject: 'Software License Renewal', owner: 'David Chen', category: 'IT', status: 'Rejected', amount: 899.00, currency: 'USD' },
        { id: 5, subject: 'Team Offsite Event', owner: 'Michael Brown', category: 'Team Building', status: 'Approved', amount: 2400.00, currency: 'USD' },
    ]);

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
                                {approvals.map((item) => (
                                    <tr key={item.id} className="bg-white border-b border-slate-200/80 hover:bg-slate-50/70 transition-colors duration-150">
                                        <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">{item.subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.owner}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                                        <td className="px-6 py-4">
                                            <StatusPill status={item.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900 whitespace-nowrap">
                                            {item.amount.toFixed(2)}
                                            <span className="ml-1 text-xs text-slate-400">({item.currency})</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="font-bold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg px-4 py-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
                                                    Approve
                                                </button>
                                                <button className="font-bold text-white bg-slate-500 hover:bg-slate-600 rounded-lg px-4 py-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Footer / Pagination */}
                    <footer className="flex justify-between items-center p-4 bg-slate-50/50 border-t border-slate-200">
                         <span className="text-sm text-slate-500">Showing 1 to 5 of 20 results</span>
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


