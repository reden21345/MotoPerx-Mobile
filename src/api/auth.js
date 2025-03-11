import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.100.100:5000/api/v1'; 

// Login User
export const loginUser = async (email, password) => {
    try {

        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

        await AsyncStorage.setItem('token', response.data.token);

        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
};

// Register User
export const registerUser = async (name, email, password) => {
    try {

        const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });

        await AsyncStorage.setItem('token', response.data.token);

        return response.data;

    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

// Logout User
export const logoutUser = async () => {
    
    await AsyncStorage.removeItem('token');

};