// API Configuration and Base Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

// Base API function with authentication
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add authorization header if token exists
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);

        // Handle unauthorized responses
        if (response.status === 401) {
            removeAuthToken();
            window.dispatchEvent(new Event('authExpired'));
            throw new Error('Authentication expired');
        }

        // Handle other error responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// API service functions
export const apiService = {
    // Authentication endpoints
    auth: {
        login: (credentials) => apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

        register: (userData) => apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

        forgotPassword: (email) => apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

        resetPassword: (token, newPassword) => apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        }),

        getProfile: () => apiRequest('/auth/profile'),

        updateProfile: (profileData) => apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        }),
    },

    // Expense endpoints
    expenses: {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/expenses?${queryString}`);
        },

        getById: (id) => apiRequest(`/expenses/${id}`),

        create: (expenseData) => apiRequest('/expenses', {
            method: 'POST',
            body: JSON.stringify(expenseData),
        }),

        update: (id, expenseData) => apiRequest(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(expenseData),
        }),

        delete: (id) => apiRequest(`/expenses/${id}`, {
            method: 'DELETE',
        }),

        submit: (id) => apiRequest(`/expenses/${id}/submit`, {
            method: 'POST',
        }),

        getStats: () => apiRequest('/expenses/stats'),
    },

    // Category endpoints
    categories: {
        getAll: (includeInactive = false) => apiRequest(`/categories?includeInactive=${includeInactive}`),

        getById: (id) => apiRequest(`/categories/${id}`),

        create: (categoryData) => apiRequest('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        }),

        update: (id, categoryData) => apiRequest(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        }),

        delete: (id) => apiRequest(`/categories/${id}`, {
            method: 'DELETE',
        }),

        seedDefaults: () => apiRequest('/categories/seed-defaults', {
            method: 'POST',
        }),
    },

    // Approval endpoints
    approvals: {
        getPending: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/approvals/pending?${queryString}`);
        },

        getById: (id) => apiRequest(`/approvals/${id}`),

        approve: (id, comments) => apiRequest(`/approvals/${id}/approve`, {
            method: 'POST',
            body: JSON.stringify({ comments }),
        }),

        reject: (id, comments) => apiRequest(`/approvals/${id}/reject`, {
            method: 'POST',
            body: JSON.stringify({ comments }),
        }),

        delegate: (id, delegateTo, reason) => apiRequest(`/approvals/${id}/delegate`, {
            method: 'POST',
            body: JSON.stringify({ delegateTo, reason }),
        }),

        getStats: () => apiRequest('/approvals/stats'),

        getOverdue: () => apiRequest('/approvals/admin/overdue'),
    },

    // User management endpoints (admin only)
    users: {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/users?${queryString}`);
        },

        getById: (id) => apiRequest(`/users/profile/${id}`),

        update: (id, userData) => apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        }),

        delete: (id) => apiRequest(`/users/${id}`, {
            method: 'DELETE',
        }),

        changePassword: (id, passwords) => apiRequest(`/users/profile/${id}/password`, {
            method: 'PUT',
            body: JSON.stringify(passwords),
        }),

        getStats: () => apiRequest('/users/admin/stats'),
    },
};

// Token management utilities
export const tokenManager = {
    set: setAuthToken,
    get: getAuthToken,
    remove: removeAuthToken,
    isValid: () => {
        const token = getAuthToken();
        if (!token) return false;

        try {
            // Basic JWT expiration check (you might want to use a JWT library)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },
};

export default apiService;