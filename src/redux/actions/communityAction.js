import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Create Community
export const createCommunity = createAsyncThunk('community/createCommunity', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(`${apiKey}/api/v1/communities`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Get community data
export const getCommunityById = createAsyncThunk('community/getCommunityById', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.get(`${apiKey}/api/v1/community/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Update community status
export const updateStatus = createAsyncThunk('community/updateStatus', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {id} = data;
        
        const response = await axios.patch(`${apiKey}/api/v1/community/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Add Members
export const addMember = createAsyncThunk('community/addMember', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const { communityId } = data;
        
        const response = await axios.put(`${apiKey}/api/v1/community/${communityId}/members`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Remove members
export const removeMember = createAsyncThunk('community/removeMember', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const { communityId } = data;
        
        const response = await axios.patch(`${apiKey}/api/v1/community/${communityId}/members`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Update community
export const updateCommunity = createAsyncThunk('admins/updateCommunity', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {_id} = data;

        const response = await axios.put(`${apiKey}/api/v1/community/${_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update community');
    }
});

// Update community
export const deleteCommunity = createAsyncThunk('admins/deleteCommunity', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.delete(`${apiKey}/api/v1/community/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update community');
    }
});

// Add Members
export const changeMemberRole = createAsyncThunk('community/changeMemberRole', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const { communityId } = data;
        
        const response = await axios.patch(`${apiKey}/api/v1/community/${communityId}/roles`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Something went wrong');
    }
});

// Get communities for user
export const getCommunitiesForUser = createAsyncThunk('communities/getCommunitiesForUser', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${apiKey}/api/v1/communities/user`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get user communities');
    }
});