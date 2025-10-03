import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Get comments
export const getComments = createAsyncThunk('comments/getComments', async (postId, thunkAPI) => {
    try {
        const response = await axios.get(`${apiKey}/api/v1/comments/post/${postId}`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 
            'Failed to get comments of a post');
    }
});

// Add comment
export const addComment = createAsyncThunk('comments/addComment', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${apiKey}/api/v1/comments`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to add comment');
    }
});

// Update Comment
export const updateComment = createAsyncThunk('comments/updateComment', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {_id} = data;

        const response = await axios.put(`${apiKey}/api/v1/comment/${_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update comment');
    }
});

// Delete Comment
export const deleteComment = createAsyncThunk('comments/deleteComment', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.delete(`${apiKey}/api/v1/comment/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to delete comment');
    }
});