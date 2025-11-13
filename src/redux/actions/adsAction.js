import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";

const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2?.extra?.EXPO_URL;

// Get all ads
export const getAllAds = createAsyncThunk('ads/getAllAds', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${apiKey}/api/v1/ads`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
    }
});

// Create ad with FormData (multipart)
export const createAd = createAsyncThunk('ads/createAd', async (adData, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(`${apiKey}/api/v1/ads`, adData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
    }
});

// Deactivate ad
export const deactivateAd = createAsyncThunk('ads/deactivateAd', async (adId, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.patch(`${apiKey}/api/v1/ads/${adId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
    }
});