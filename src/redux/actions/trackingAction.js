import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";
const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2.extra?.EXPO_URL;

// Save tracking
export const saveTracking = createAsyncThunk(
  "tracking/saveTracking",
  async (data, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(`${apiKey}/api/v1/tracking`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to save traveled distance"
      );
    }
  }
);


export const getTrackingHistory  = createAsyncThunk(
  "tracking/getTrackingHistory",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(`${apiKey}/api/v1/tracking/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errMessage || "Failed to get travel history"
      );
    }
  }
);