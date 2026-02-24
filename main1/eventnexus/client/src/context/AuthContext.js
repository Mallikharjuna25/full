import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await authAPI.getMe();
                setUser(data.user);
            } catch (err) {
                console.error('Failed to fetch user', err);
                clearAuth();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    const clearAuth = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const login = async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (formData) => {
        const { data } = await authAPI.register(formData);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const adminLogin = async (email, secretKey) => {
        const { data } = await authAPI.adminLogin({ email, secretKey });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        clearAuth();
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, adminLogin, logout, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
