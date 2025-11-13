import { createSlice } from "@reduxjs/toolkit";
import {
  createAd,
  deactivateAd,
  getAllAds
} from "../actions/adsAction";

const adSlice = createSlice({
  name: "ads",
  initialState: {
    activeAds: [],
    count: 0,
    loading: false,
    message: null,
    success: false,
    error: null,
  },
  reducers: {
    clearAdState: (state) => {
      state.activeAds = [];
      state.count = 0;
      state.message = null;
      state.success = false;
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(createAd.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      
      // Get All Ads
      .addCase(getAllAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAds.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.activeAds = action.payload.ads;
      })
      .addCase(getAllAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Deactivate Ad
      .addCase(deactivateAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateAd.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deactivateAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdState, clearSuccess } = adSlice.actions;
export default adSlice.reducer;