import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Get User Badges
export const getUserBadges = createAsyncThunk('badges/getUserBadges', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${apiKey}/api/v1/badges/me`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get badges');
    }
});