import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Get QR Code
export const getQRCode = createAsyncThunk('QRCode/getQRCode', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${apiKey}/api/v1/qr/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get QRCode');
    }
});

// Get QR Code
export const getUserFromQr = createAsyncThunk('QRCode/getUserFromQr', async (qrCode, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.get(`${apiKey}/api/v1/partner/${qrCode}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get user from qr code');
    }
});

// Get QR Code
export const generateQRCode = createAsyncThunk('QRCode/generateQRCode', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(`${apiKey}/api/v1/qr/generate`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to generate qr code');
    }
});