import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import {
    ArrowLeft,
    Save,
    Send,
    DollarSign,
    FileText,
    Tag,
    Calendar,
    Upload,
    X
} from 'lucide-react';

const ExpenseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        amount: '',
        currency: 'USD',
        category: '',
        tags: []
    });
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(isEditing);
    const [errors, setErrors] = useState({});
    const [currentTag, setCurrentTag] = useState('');

    useEffect(() => {
        loadCategories();
        if (isEditing) {
            loadExpense();
        }
    }, [id]);

    const loadCategories = async () => {
        try {
            const response = await apiService.categories.getAll();
            setCategories(response.categories || []);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadExpense = async () => {
        try {
            setIsLoadingData(true);
            const response = await apiService.expenses.getById(id);

            setFormData({
                subject: response.expense.subject || '',
                description: response.expense.description || '',
                amount: response.expense.amount || '',
                currency: response.expense.currency || 'USD',
                category: response.expense.category?._id || '',
                tags: response.expense.tags || []
            });
        } catch (error) {
            console.error('Failed to load expense:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAddTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()]
            }));
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Valid amount is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const expenseData = {
                ...formData,
                amount: parseFloat(formData.amount),
                tags: formData.tags
            };

            if (isEditing) {
                await apiService.expenses.update(id, expenseData);
            } else {
                await apiService.expenses.create(expenseData);
            }

            navigate('/expenses');
        } catch (error) {
            console.error('Failed to save expense:', error);
            setErrors({ general: 'Failed to save expense. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!formData.subject.trim()) {
            setErrors({ subject: 'Subject is required for draft' });
            return;
        }

        setIsLoading(true);

        try {
            const expenseData = {
                ...formData,
                amount: formData.amount ? parseFloat(formData.amount) : 0,
                status: 'Draft'
            };

            if (isEditing) {
                await apiService.expenses.update(id, expenseData);
            } else {
                await apiService.expenses.create(expenseData);
            }

            navigate('/expenses');
        } catch (error) {
            console.error('Failed to save draft:', error);
            setErrors({ general: 'Failed to save draft. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700">Loading expense...</p>
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
                            <button
                                onClick={() => navigate('/expenses')}
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Expenses
                            </button>
                            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gray-900" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Expense' : 'New Expense'}
                                </h1>
                                <p className="text-gray-600">
                                    {isEditing ? 'Update expense details' : 'Create a new expense report'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg border-4 border-gray-900 p-8">
                    {errors.general && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-700 text-sm">{errors.general}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                                Expense Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 ${
                                    errors.subject ? 'border-red-400' : 'border-gray-300 focus:border-yellow-400'
                                }`}
                                placeholder="Brief description of the expense"
                            />
                            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300"
                                placeholder="Detailed description of the expense..."
                            />
                        </div>

                        {/* Amount and Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Amount *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 ${
                                            errors.amount ? 'border-red-400' : 'border-gray-300 focus:border-yellow-400'
                                        }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                            </div>

                            <div>
                                <label htmlFor="currency" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Currency
                                </label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                    <option value="CAD">CAD (C$)</option>
                                </select>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all duration-300 ${
                                    errors.category ? 'border-red-400' : 'border-gray-300 focus:border-yellow-400'
                                }`}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 mb-2">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none"
                                    placeholder="Add a tag..."
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                                >
                                    Add
                                </button>
                            </div>

                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Receipt Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Receipt (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-yellow-400 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">
                                    Drag and drop your receipt here, or{' '}
                                    <button className="text-yellow-600 hover:text-yellow-700 font-semibold">
                                        browse
                                    </button>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Supports: JPG, PNG, PDF (Max 10MB)
                                </p>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 inline mr-2" />
                                Save as Draft
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        {isEditing ? 'Update Expense' : 'Create Expense'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ExpenseForm;