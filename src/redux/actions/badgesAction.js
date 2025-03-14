import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.100:5000/api/v1';

// Get User Badges
export const getUserBadges = createAsyncThunk('badges/getUserBadges', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/badges/me`);
        return response.data;
    } catch (error) {
        console.log('❌ Login Error:', error.response?.data || error);
        
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to get badges');
    }
});