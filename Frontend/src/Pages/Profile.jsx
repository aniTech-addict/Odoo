import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import {
    User,
    Mail,
    Shield,
    Calendar,
    Edit,
    Save,
    X,
    Key,
    AlertCircle
} from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        const profileErrors = {};
        if (!formData.username.trim()) {
            profileErrors.username = 'Username is required';
        }
        if (!formData.email.trim()) {
            profileErrors.email = 'Email is required';
        }

        if (Object.keys(profileErrors).length > 0) {
            setErrors(profileErrors);
            return;
        }

        try {
            setIsLoading(true);
            setErrors({});
            setSuccessMessage('');

            const result = await updateProfile(formData);

            if (result.success) {
                setSuccessMessage('Profile updated successfully!');
                setIsEditing(false);
            } else {
                setErrors({ general: result.error });
            }
        } catch (error) {
            setErrors({ general: 'Failed to update profile. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const passwordErrors = {};
        if (!passwordData.currentPassword) {
            passwordErrors.currentPassword = 'Current password is required';
        }
        if (!passwordData.newPassword) {
            passwordErrors.newPassword = 'New password is required';
        }
        if (passwordData.newPassword.length < 6) {
            passwordErrors.newPassword = 'New password must be at least 6 characters';
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            passwordErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(passwordErrors).length > 0) {
            setErrors(passwordErrors);
            return;
        }

        try {
            setIsLoading(true);
            setErrors({});
            setSuccessMessage('');

            // Note: This would need a password change endpoint in the backend
            // For now, we'll use the existing profile update mechanism
            alert('Password change functionality would be implemented with a dedicated endpoint.');

        } catch (error) {
            setErrors({ general: 'Failed to change password. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;

        if (formType === 'profile') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else if (formType === 'password') {
            setPasswordData(prev => ({ ...prev, [name]: value }));
        }

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            'admin': 'bg-purple-100 text-purple-800',
            'editor': 'bg-blue-100 text-blue-800',
            'user': 'bg-gray-100 text-gray-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b-4 border-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-900" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                                <p className="text-gray-600">Manage your account settings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border-4 border-gray-900 mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                                activeTab === 'profile'
                                    ? 'bg-yellow-400 text-gray-900 border-b-2 border-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <User className="w-5 h-5 inline mr-2" />
                            Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                                activeTab === 'password'
                                    ? 'bg-yellow-400 text-gray-900 border-b-2 border-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Key className="w-5 h-5 inline mr-2" />
                            Change Password
                        </button>
                    </div>

                    {/* Error/Success Messages */}
                    {errors.general && (
                        <div className="p-4 bg-red-50 border-b border-red-200">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                <p className="text-red-700">{errors.general}</p>
                            </div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-4 bg-green-50 border-b border-green-200">
                            <p className="text-green-700">{successMessage}</p>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Username
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={(e) => handleInputChange(e, 'profile')}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 ${
                                                    !isEditing
                                                        ? 'bg-gray-50 text-gray-600'
                                                        : errors.username
                                                            ? 'border-red-400 focus:border-red-400'
                                                            : 'border-gray-300 focus:border-yellow-400'
                                                }`}
                                            />
                                        </div>
                                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange(e, 'profile')}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 ${
                                                    !isEditing
                                                        ? 'bg-gray-50 text-gray-600'
                                                        : errors.email
                                                            ? 'border-red-400 focus:border-red-400'
                                                            : 'border-gray-300 focus:border-yellow-400'
                                                }`}
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Role (Read-only) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <div className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                                                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Info (Read-only) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Member Since
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <div className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600">
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Last Login
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <div className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600">
                                                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                {isEditing && (
                                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => handleInputChange(e, 'password')}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 ${
                                            errors.currentPassword ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-yellow-400'
                                        }`}
                                        placeholder="Enter your current password"
                                    />
                                    {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={(e) => handleInputChange(e, 'password')}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 ${
                                            errors.newPassword ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-yellow-400'
                                        }`}
                                        placeholder="Enter your new password"
                                    />
                                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => handleInputChange(e, 'password')}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 ${
                                            errors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-yellow-400'
                                        }`}
                                        placeholder="Confirm your new password"
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Changing...
                                            </>
                                        ) : (
                                            <>
                                                <Key className="w-4 h-4 mr-2" />
                                                Change Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;