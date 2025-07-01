import { createSlice } from "@reduxjs/toolkit";
import { getTrackingHistory, saveTracking } from "../actions/trackingAction";

const trackingSlice = createSlice({
  name: "tracks",
  initialState: {
    tracks: [],
    message: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearTrackingState: (state) => {
      state.tracks = [];
      state.success = false;
      state.error = null;
      state.message = null;
    },
    clearMessage : (state) => {
      state.success = false;
      state.message = null;
    },
    clearSuccess : (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(saveTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveTracking.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(saveTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTrackingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrackingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = action.payload.tracks;
      })
      .addCase(getTrackingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearTrackingState, clearSuccess, clearMessage } = trackingSlice.actions;
export default trackingSlice.reducer;