import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

const TOKEN_KEY = "en_token";
const USER_KEY = "en_user";

const saveToStorage = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearStorage = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem(TOKEN_KEY);
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const storedUser = localStorage.getItem(USER_KEY);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                setToken(storedToken);

                const { data } = await authAPI.getMe();
                setUser(data.user);
                saveToStorage(storedToken, data.user);
            } catch (error) {
                clearStorage();
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        const handleAuthExpired = () => {
            clearStorage();
            setUser(null);
            setToken(null);
        };

        window.addEventListener("auth:expired", handleAuthExpired);
        return () => {
            window.removeEventListener("auth:expired", handleAuthExpired);
        };
    }, []);

    const loginStudent = async (email, password) => {
        setAuthError(null);
        try {
            const { data } = await authAPI.loginStudent({ email, password });
            saveToStorage(data.token, data.user);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            setAuthError(message);
            throw new Error(message);
        }
    };

    const loginCoordinator = async (collegeName, email, password) => {
        setAuthError(null);
        try {
            const { data } = await authAPI.loginCoordinator({ collegeName, email, password });
            saveToStorage(data.token, data.user);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            setAuthError(message);
            throw new Error(message);
        }
    };

    const registerStudent = async (formData) => {
        setAuthError(null);
        try {
            const { data } = await authAPI.registerStudent(formData);
            saveToStorage(data.token, data.user);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            setAuthError(message);
            throw new Error(message);
        }
    };

    const registerCoordinator = async (formData) => {
        setAuthError(null);
        try {
            const { data } = await authAPI.registerCoordinator(formData);
            saveToStorage(data.token, data.user);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            setAuthError(message);
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            // Ignored
        } finally {
            clearStorage();
            setUser(null);
            setToken(null);
            setAuthError(null);
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        const currentToken = localStorage.getItem(TOKEN_KEY);
        if (currentToken) {
            saveToStorage(currentToken, updatedUser);
        }
    };

    const clearError = () => setAuthError(null);

    const isAuthenticated = !!user;
    const isStudent = user?.role === "student";
    const isCoordinator = user?.role === "coordinator";

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                authError,
                isAuthenticated,
                isStudent,
                isCoordinator,
                loginStudent,
                loginCoordinator,
                registerStudent,
                registerCoordinator,
                logout,
                updateUser,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
