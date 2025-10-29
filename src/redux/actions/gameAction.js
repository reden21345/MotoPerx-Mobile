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

// Get Fuel Challenge Scenario
export const getFuelChallenge = createAsyncThunk(
  "fuel/getFuelChallenge",
  async ({ isCompetitive = false }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${apiKey}/api/v1/fuel/challenge?isCompetitive=${isCompetitive}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get fuel challenge"
      );
    }
  }
);

// Submit Fuel Challenge
export const submitFuelChallenge = createAsyncThunk(
  "fuel/submitFuelChallenge",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        `${apiKey}/api/v1/fuel/submit`,
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to submit fuel challenge"
      );
    }
  }
);

// Get User Fuel History
export const getUserFuelHistory = createAsyncThunk(
  "fuel/getUserFuelHistory",
  async ({ page = 1, limit = 10, isCompetitive }, thunkAPI) => {
    try {
      let url = `${apiKey}/api/v1/fuel/history?page=${page}&limit=${limit}`;
      if (isCompetitive !== undefined) {
        url += `&isCompetitive=${isCompetitive}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get fuel history"
      );
    }
  }
);

// Get Fuel Leaderboard
export const getFuelLeaderboard = createAsyncThunk(
  "fuel/getFuelLeaderboard",
  async ({ limit = 10 }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${apiKey}/api/v1/fuel/leaderboard?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get fuel leaderboard"
      );
    }
  }
);

// Get User Fuel Stats
export const getUserFuelStats = createAsyncThunk(
  "fuel/getUserFuelStats",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${apiKey}/api/v1/fuel/stats`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get user fuel stats"
      );
    }
  }
);