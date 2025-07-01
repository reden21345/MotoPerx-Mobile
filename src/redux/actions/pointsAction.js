import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Get Points
export const getUserPoints = createAsyncThunk('points/getPoints', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${apiKey}/api/v1/points/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get points');
    }
});

// Give points to user
export const earnPoints = createAsyncThunk('points/earnPoints', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(`${apiKey}/api/v1/points/earn`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Give points to user
export const redeemPoints = createAsyncThunk('points/redeemPoints', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(`${apiKey}/api/v1/points/redeem`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});