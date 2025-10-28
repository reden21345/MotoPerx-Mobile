import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Reaction Game actions:
export const saveReactionTime = createAsyncThunk(
  "reaction/saveReactionTime",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${apiKey}/api/v1/reaction/save`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to save reaction time"
      );
    }
  }
);

export const getUserReactionGames = createAsyncThunk(
  "reaction/getUserReactionGames",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiKey}/api/v1/reaction/user`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get user reaction game data"
      );
    }
  }
);

export const getReactionLeaderboard = createAsyncThunk(
  "reaction/getReactionLeaderboard",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiKey}/api/v1/reaction/leaderboard`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get reaction game leaderboard data"
      );
    }
  }
);


// Quiz Game actions:
export const getQuizQuestions = createAsyncThunk(
  "quiz/getQuizQuestions",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiKey}/api/v1/quiz/questions`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get quiz questions"
      );
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  "quiz/submitQuizAnswers",
  async (answers, thunkAPI) => {  
    try {
      const response = await axios.post(`${apiKey}/api/v1/quiz/submit`, answers);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to submit quiz answers"
      );
    }
  }
);

export const getUserQuizHistory = createAsyncThunk(
  "quiz/getUserQuizHistory",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiKey}/api/v1/quiz/history`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get quiz history"
      );
    }
  }
);

export const getQuizLeaderboard = createAsyncThunk(
  "quiz/getQuizLeaderboard",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiKey}/api/v1/quiz/leaderboard`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get quiz leaderboard"
      );
    }
  }
);