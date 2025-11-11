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
      state.ads = [];
      state.partners = [],
      state.communities = [],
      state.count = 0;
      state.message = null,
      state.success = false,
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.count = action.payload.count;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearAdState, clearSuccess } = adSlice.actions;
export default adSlice.reducer;
