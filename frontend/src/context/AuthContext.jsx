import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            fetchUser();
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/user');
            setUser(data);
        } catch (error) {
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const getCsrfCookie = async () => {
        await api.get('/sanctum/csrf-cookie', { baseURL: '' });
    };

    const login = async (credentials) => {
        await getCsrfCookie();
        const { data } = await api.post('/login', credentials);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        await getCsrfCookie();
        const { data } = await api.post('/register', userData);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } finally {
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
