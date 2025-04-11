import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.100:5000/api/v1';

// Get QR Code
export const getQRCode = createAsyncThunk('QRCode/getQRCode', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/qr/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to get QRCode');
    }
});

// Get QR Code
export const getUserFromQr = createAsyncThunk('QRCode/getUserFromQr', async (qrCode, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log("Token: ", token);
        
        const response = await axios.get(`${API_BASE_URL}/partner/${qrCode}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("API Response: ", response.data); // Debugging API response
        return response.data;
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to get points');
    }
});