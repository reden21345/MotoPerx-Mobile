import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Async Thunks
export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, thunkAPI) => {
    try {
        const response = await axios.post(`${apiKey}/api/v1/login`, { email, password });

        await AsyncStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Login failed');
    }
});

// Register User and Generate QR Code
export const registerUser = createAsyncThunk('auth/registerUser', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${apiKey}/api/v1/register`, data);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Registration failed');
    }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
    try {
      await axios.post(`${apiKey}/api/v1/logout`);
      await AsyncStorage.removeItem('token');
      return {};
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.errMessage || 'Failed to logouts');
    }
  });

// Get Profile 
export const profile = createAsyncThunk('auth/profile', async (_, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.get(`${apiKey}/api/v1/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Error fetching profile');
    }
});

// Edit Profile
export const editProfile = createAsyncThunk('auth/editProfile', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.put(`${apiKey}/api/v1/me/update`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Edit password
export const editPassword = createAsyncThunk('auth/editPassword', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.put(`${apiKey}/api/v1/password/update`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Forgot password
export const forgetPassword = createAsyncThunk('auth/forgetPassword', async ({email}, thunkAPI) => {
    try {
        
        const response = await axios.post(`${apiKey}/api/v1/password/forgot`, {email});

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Forgot password
export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, thunkAPI) => {
    try {
        const { token } = data;
     
        const response = await axios.put(`${apiKey}/api/v1/password/reset/${token}`, data);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Confirm Account
export const confirmAccount = createAsyncThunk('auth/confirmAccount', async (token, thunkAPI) => {
    try {
        const response = await axios.post(`${apiKey}/api/v1/confirm/${token}`);
        const resToken = response.data.token;

        const qrResponse = await axios.post(`${apiKey}/api/v1/qr/generate`, {}, {
            headers: { Authorization: `Bearer ${resToken}` }
        });

        return { ...response.data, qrCode: qrResponse.data.qrCode };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Validate referral code
export const validateReferral = createAsyncThunk('auth/validateReferral', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${apiKey}/api/v1/validate/referral`, data);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Error in validation code');
    }
});