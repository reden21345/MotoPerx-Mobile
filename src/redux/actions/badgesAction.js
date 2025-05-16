import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@env';

// Get User Badges
export const getUserBadges = createAsyncThunk('badges/getUserBadges', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/badges/me`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get badges');
    }
});