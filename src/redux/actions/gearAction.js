import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Get All Gears (ADMIN)
export const getAllGears = createAsyncThunk('gears/getAllGears', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${apiKey}/api/v1/gears`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get gears');
    }
});

// Create Gears
export const createGears = createAsyncThunk('gears/createGears', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${apiKey}/api/v1/gears`, data, {
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

        const response = await axios.put(`${apiKey}/api/v1/gear/${id}`, data, {
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

// Get user gear
export const getUserGear = createAsyncThunk('gears/getUserGear', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get(`${apiKey}/api/v1/gears/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get user gears');
    }
});