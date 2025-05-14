import { createSlice } from "@reduxjs/toolkit";
import { notifChecker } from "../actions/notifAction";

const notifSlice = createSlice({
  name: "notifications",
  initialState: {
    notifDetails: null,
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifs: (state) => {
      state.notifDetails = null;
      state.count = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(notifChecker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(notifChecker.fulfilled, (state, action) => {
        state.loading = false;
        state.notifDetails = action.payload.notification;
        state.count = action.payload.count;
      })
      .addCase(notifChecker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearNotifs } = notifSlice.actions;
export default notifSlice.reducer;
