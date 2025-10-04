import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, tokenManager } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state on app load
    useEffect(() => {
        const initAuth = async () => {
            const token = tokenManager.get();

            if (token && tokenManager.isValid()) {
                try {
                    const response = await apiService.auth.getProfile();
                    setUser(response.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    tokenManager.remove();
                    setIsAuthenticated(false);
                }
            } else {
                tokenManager.remove();
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        initAuth();

        // Listen for auth expiration events
        const handleAuthExpired = () => {
            setUser(null);
            setIsAuthenticated(false);
        };

        window.addEventListener('authExpired', handleAuthExpired);

        return () => {
            window.removeEventListener('authExpired', handleAuthExpired);
        };
    }, []);

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            const response = await apiService.auth.login({ email, password });

            tokenManager.set(response.token);
            setUser(response.user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setIsLoading(true);
            const response = await apiService.auth.register(userData);

            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        tokenManager.remove();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await apiService.auth.updateProfile(profileData);
            setUser(response.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const forgotPassword = async (email) => {
        try {
            await apiService.auth.forgotPassword(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            await apiService.auth.resetPassword(token, newPassword);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};