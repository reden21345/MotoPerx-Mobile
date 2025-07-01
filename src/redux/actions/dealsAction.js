import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Get Deals
export const getAllDeals = createAsyncThunk('deals/getDeals', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${apiKey}/api/v1/deals`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get deals');
    }
});

// Create Deals
export const createDeals = createAsyncThunk('deals/createDeals', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${apiKey}/api/v1/deals`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to create deal');
    }
});

// Update Deals
export const updateDeals = createAsyncThunk('deals/updateDeals', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {id} = data;

        const response = await axios.put(`${apiKey}/api/v1/deal/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update deal');
    }
});

// Delete Deal
export const deleteDeal = createAsyncThunk('deals/deleteDeal', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.delete(`${apiKey}/api/v1/deal/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to delete deal');
    }
});

// Get redeemed deals
export const getRedeemedDeals = createAsyncThunk('deals/getRedeemedDeals', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${apiKey}/api/v1/deals/redeemed`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get deals');
    }
});

// Use Deal
export const markDealAsUsed = createAsyncThunk('deals/markDealAsUsed', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.patch(`${apiKey}/api/v1/deals/redeemed`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update deal');
    }
});