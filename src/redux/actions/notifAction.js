import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@env';

// Check user device
export const notifChecker = createAsyncThunk('notifications/notifChecker', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${API_BASE_URL}/notifications/check`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to check notification details');
    }
});

// Check user device
export const getUserNotifications = createAsyncThunk('notifications/getUserNotifications', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get notifications');
    }
});

// Send push notification
export const sendNotifications = createAsyncThunk('notifications/sendNotifications', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${API_BASE_URL}/notifications/send`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to send notification');
    }
});