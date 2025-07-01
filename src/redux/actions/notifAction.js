import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Check user device
export const notifChecker = createAsyncThunk('notifications/notifChecker', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${apiKey}/api/v1/notifications/check`, data, {
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

        const response = await axios.get(`${apiKey}/api/v1/notifications`, {
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

        const response = await axios.post(`${apiKey}/api/v1/notifications/send`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to send notification');
    }
});

// Send push notification
export const sendSingleUserNotif = createAsyncThunk('notifications/sendSingleUserNotif', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${apiKey}/api/v1/notifications/send/single`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to send notification');
    }
});

// Mark as seen
export const markAsSeen = createAsyncThunk('notifications/markAsSeen', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.put(`${apiKey}/api/v1/notifications/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to mark as seen');
    }
});

// Delete Notification
export const deleteNotif = createAsyncThunk('notifications/deleteNotif', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.delete(`${apiKey}/api/v1/notifications/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to delete notification');
    }
});