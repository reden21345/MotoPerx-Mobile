import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@env';

// Apply for partnership
export const apply = createAsyncThunk('partner/apply', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(`${API_BASE_URL}/partners`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Get partner store details
export const getPartner = createAsyncThunk('partner/getPartner', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.get(`${API_BASE_URL}/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Update partnership status
export const updateStatus = createAsyncThunk('partner/updateStatus', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {id} = data;
        
        const response = await axios.put(`${API_BASE_URL}/partner/${id}/status`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Add employees
export const addEmployee = createAsyncThunk('partner/addEmployee', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.put(`${API_BASE_URL}/partners/employee`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Remove employees
export const removeEmployee = createAsyncThunk('partner/removeEmployee', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.patch(`${API_BASE_URL}/partners/employee`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Get partner store details
export const getNearbyPartners = createAsyncThunk('partner/getNearbyPartners', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(`${API_BASE_URL}/partners/nearby`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Error getting nearby partners');
    }
});

// Edit partner
export const editPartner = createAsyncThunk('admins/editPartner', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {_id} = data;

        const response = await axios.put(`${API_BASE_URL}/partner/${_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update partner');
    }
});