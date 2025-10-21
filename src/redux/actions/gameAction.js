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
