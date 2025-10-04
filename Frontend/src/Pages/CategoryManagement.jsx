import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Tag,
    Save,
    X,
    AlertCircle
} from 'lucide-react';

const CategoryManagement = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [formErrors, setFormErrors] = useState({});
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await apiService.categories.getAll(true); // Include inactive
            setCategories(response.categories || []);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setError('Failed to load categories. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setFormErrors({});
        setShowForm(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            try {
                setActionLoading(categoryId);
                await apiService.categories.delete(categoryId);
                await loadCategories();
                alert('Category deleted successfully!');
            } catch (error) {
                console.error('Failed to delete category:', error);
                alert('Failed to delete category. Please try again.');
            } finally {
                setActionLoading(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Category name is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editingCategory) {
                await apiService.categories.update(editingCategory._id, formData);
                alert('Category updated successfully!');
            } else {
                await apiService.categories.create(formData);
                alert('Category created successfully!');
            }

            setShowForm(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            await loadCategories();
        } catch (error) {
            console.error('Failed to save category:', error);
            alert('Failed to save category. Please try again.');
        }
    };

    const handleToggleActive = async (category) => {
        try {
            await apiService.categories.update(category._id, {
                isActive: !category.isActive
            });
            await loadCategories();
        } catch (error) {
            console.error('Failed to toggle category status:', error);
            alert('Failed to update category status. Please try again.');
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700">Loading categories...</p>
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
                                <Tag className="w-6 h-6 text-gray-900" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                                <p className="text-gray-600">Manage expense categories</p>
                            </div>
                        </div>

                        <button
                            onClick={handleCreate}
                            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                        >
                            <Plus className="w-4 h-4 inline mr-2" />
                            New Category
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg border-4 border-gray-900 p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none"
                        />
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-lg border-4 border-gray-900 p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            {editingCategory ? 'Edit Category' : 'Create New Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none ${
                                        formErrors.name ? 'border-red-400' : 'border-gray-300 focus:border-yellow-400'
                                    }`}
                                    placeholder="Enter category name"
                                />
                                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none"
                                    placeholder="Enter category description"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                                >
                                    <Save className="w-4 h-4 inline mr-2" />
                                    {editingCategory ? 'Update' : 'Create'} Category
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-4 h-4 inline mr-2" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Categories Grid */}
                <div className="bg-white rounded-2xl shadow-lg border-4 border-gray-900 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <div
                                key={category._id}
                                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                                    category.isActive
                                        ? 'border-gray-900 bg-white hover:shadow-lg'
                                        : 'border-gray-300 bg-gray-50 opacity-60'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="text-sm text-gray-600">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleToggleActive(category)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                category.isActive
                                                    ? 'text-green-600 hover:bg-green-50'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-green-600' : 'bg-gray-400'}`} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            disabled={actionLoading === category._id}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {actionLoading === category._id ? (
                                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className={`px-2 py-1 rounded-full ${
                                        category.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>

                                    <span className="text-gray-500">
                                        Created: {new Date(category.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                            <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'No categories found' : 'No categories yet'}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Create your first expense category to get started.'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={handleCreate}
                                    className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                                >
                                    <Plus className="w-4 h-4 inline mr-2" />
                                    Create Category
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;