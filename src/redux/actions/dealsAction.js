import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.100:5000/api/v1';

// Get Deals
export const getAllDeals = createAsyncThunk('deals/getDeals', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/deals`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get deals');
    }
});