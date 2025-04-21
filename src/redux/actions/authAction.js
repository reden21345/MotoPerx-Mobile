import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.100:5000/api/v1';

// Async Thunks
export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, thunkAPI) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

        console.log('✅ Login Successful:', response.data); // Log Response

        await AsyncStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.log('❌ Login Error:', error.response?.data?.errMessage || error); // Log Error Response
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Login failed');
    }
});

// Register User and Generate QR Code
export const registerUser = createAsyncThunk('auth/registerUser', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, data);
        const token = response.data.token;
        await AsyncStorage.setItem('token', token);

        // Generate QR Code for the registered user
        const qrResponse = await axios.post(`${API_BASE_URL}/qr/generate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return { ...response.data, qrCode: qrResponse.data.qrCode };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Registration failed');
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
    try {
      await axios.post(`${API_BASE_URL}/logout`);
      await AsyncStorage.removeItem('token');
      return {};
    } catch (error) {
      console.error('Logout API error:', error?.response?.data || error.message);
      return thunkAPI.rejectWithValue(error?.response?.data?.errMessage || 'Failed to logouts');
    }
  });

// Get Profile 
export const profile = createAsyncThunk('auth/profile', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.get(`${API_BASE_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Error fetching profile');
    }
});

// Edit Profile
export const editProfile = createAsyncThunk('auth/editProfile', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.put(`${API_BASE_URL}/me/update`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Edit password
export const editPassword = createAsyncThunk('auth/editPassword', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.put(`${API_BASE_URL}/password/update`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});