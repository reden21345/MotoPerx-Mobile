import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, logoutUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {

        const token = await AsyncStorage.getItem('token');

        if (token) {
            setUser({ token }); // Store token in state
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        console.log(email, password)
        try {
            const data = await loginUser(email, password);
            setUser({ token: data.token, profile: data.user });
        } catch (error) {
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await registerUser(name, email, password);
            setUser({ token: data.token, profile: data.user });
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};