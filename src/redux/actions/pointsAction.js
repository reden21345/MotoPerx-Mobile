import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.100:5000/api/v1';

// Async Thunks
export const getUserPoints = createAsyncThunk('points/getPoints', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/points/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('✅ Get Points:', response.data);

        return response.data;
    } catch (error) {
        console.log('❌ Login Error:', error.response?.data || error);
        
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to get points');
    }
});
  
export const registerUser = createAsyncThunk('points/registerUser', async ({ name, email, password }, thunkAPI) => {
    
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});
  
export const logoutUser = createAsyncThunk('points/logoutUser', async () => {
    await AsyncStorage.removeItem('token');
});