import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@env';

// Get All Gears (ADMIN)
export const getAllGears = createAsyncThunk('gears/getAllGears', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/gears`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get gears');
    }
});

// Create Gears
export const createGears = createAsyncThunk('gears/createGears', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${API_BASE_URL}/gears`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to create gears');
    }
});

// Update Gears
export const updateGear = createAsyncThunk('gears/updateGear', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {id} = data;

        const response = await axios.put(`${API_BASE_URL}/gear/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update gear');
    }
});

// Delete Gear
export const deleteGear = createAsyncThunk('gears/deleteGear', async (id, thunkAPI) => {
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

// Get user gear
export const getUserGear = createAsyncThunk('gears/getUserGear', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get(`${API_BASE_URL}/gears/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get user gears');
    }
});