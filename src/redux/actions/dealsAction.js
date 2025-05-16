import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://motoperx-backend.onrender.com/api/v1';

// Get Deals
export const getAllDeals = createAsyncThunk('deals/getDeals', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/deals`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get deals');
    }
});

// Create Deals
export const createDeals = createAsyncThunk('deals/createDeals', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${API_BASE_URL}/deals`, data, {
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

        const response = await axios.put(`${API_BASE_URL}/deal/${id}`, data, {
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

        const response = await axios.delete(`${API_BASE_URL}/deal/${id}`, {
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
        const response = await axios.get(`${API_BASE_URL}/deals/redeemed`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get deals');
    }
});