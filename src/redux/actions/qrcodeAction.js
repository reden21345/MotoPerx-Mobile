import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.8:5000/api/v1';

// Get QR Code
export const getQRCode = createAsyncThunk('points/getQRCode', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/qr/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Qr Code: ", response.data)
        return response.data;
    } catch (error) {
        console.log('❌ Login Error:', error.response?.data || error);
        
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to get points');
    }
});