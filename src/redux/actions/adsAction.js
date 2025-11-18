import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Constants from "expo-constants";

const apiKey =
  Constants.expoConfig?.extra?.EXPO_URL ||
  Constants.manifest?.extra?.EXPO_URL ||
  Constants.manifest2?.extra?.EXPO_URL;

// Get all ads
export const getAllAds = createAsyncThunk(
  "ads/getAllAds",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${apiKey}/api/v1/ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
         error?.response?.data?.errMessage || "Failed to get ads"
      );
    }
  }
);

export const createAd = createAsyncThunk(
  "ads/createAd",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiKey}/api/v1/ads`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.errMessage || "Failed to add ads"
      );
    }
  }
);

// Deactivate ad
export const deactivateAd = createAsyncThunk(
  "ads/deactivateAd",
  async (adId, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.patch(`${apiKey}/api/v1/ads/${adId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.errMessage || "Failed to deactivate ads"
      );
    }
  }
);
