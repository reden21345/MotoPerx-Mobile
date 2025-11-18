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
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const createAd = createAsyncThunk(
  "ads/createAd",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("=== USING AXIOS UPLOAD ===");
      console.log("FormData parts:", formData._parts);

      const response = await axios.post(`${apiKey}/api/v1/ads`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds for large files
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      console.log("UPLOAD SUCCESS:", response.data);
      return response.data;
    } catch (error) {
      console.error("ACTION ERROR:", error);

      if (error.response) {
        // Server responded with an error
        console.error("Server response error:", error.response.data);
        return rejectWithValue(error.response.data.message || "Upload failed");
      } else if (error.request) {
        // Request made but no response
        console.error("No response received");
        return rejectWithValue(
          "No response from server. Please check your connection."
        );
      } else {
        // Something else went wrong
        console.error("Request setup error:", error.message);
        return rejectWithValue(error.message);
      }
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
        error.response?.data || { message: error.message }
      );
    }
  }
);
