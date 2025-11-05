import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Get home posts
export const getHomePosts = createAsyncThunk('posts/getHomePosts', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${apiKey}/api/v1/posts/home`);
        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to get home posts');
    }
});

// Create Posts
export const createPosts = createAsyncThunk('posts/createPosts', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${apiKey}/api/v1/posts`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to create post');
    }
});

// Update Posts
export const updatePost = createAsyncThunk('posts/updatePost', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const {_id} = data;

        const response = await axios.put(`${apiKey}/api/v1/post/${_id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to update post');
    }
});

// Delete Post
export const deletePost = createAsyncThunk('posts/deletePost', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.delete(`${apiKey}/api/v1/post/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to delete post');
    }
});

// Like Post
export const likePost = createAsyncThunk('posts/likePost', async (id, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.patch(`${apiKey}/api/v1/post/${id}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to like post');
    }
});

// Report Post
export const reportPost = createAsyncThunk('posts/reportPost', async (data, thunkAPI) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const { postId } = data;

        const response = await axios.post(`${apiKey}/api/v1/post/${postId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.errMessage || 'Failed to report post');
    }
});