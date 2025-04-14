import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.100:5000/api/v1';

// Get Points
export const getUserPoints = createAsyncThunk('points/getPoints', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/points/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to get points');
    }
});

// Give points to user
export const earnPoints = createAsyncThunk('points/earnPoints', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(`${API_BASE_URL}/points/earn`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("API Response: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to get points');
    }
});