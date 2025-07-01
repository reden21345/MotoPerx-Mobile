import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Get Products
export const getAllProducts = createAsyncThunk('products/getAllProducts', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get(`${apiKey}/api/v1/products`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get products');
    }
});

// Create products
export const createProduct = createAsyncThunk('products/createProduct', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${apiKey}/api/v1/products`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to create product');
    }
});

// Update product
export const updateProduct = createAsyncThunk('products/updateProduct', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {id} = data;

        const response = await axios.put(`${apiKey}/api/v1/products/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update product');
    }
});

// Remove product
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.delete(`${apiKey}/api/v1/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to remove product');
    }
});