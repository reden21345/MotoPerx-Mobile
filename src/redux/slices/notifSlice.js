import { createSlice } from "@reduxjs/toolkit";
import { getUserNotifications, notifChecker } from "../actions/notifAction";

const notifSlice = createSlice({
  name: "notifications",
  initialState: {
    notifDetails: null,
    notifications: [],
    unseen: 0,
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifs: (state) => {
      state.notifDetails = null;
      state.notifications = [],
      state.unseen = 0;
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
      })
      .addCase(notifChecker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.count = action.payload.count;
        state.unseen = action.payload.unseen;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearNotifs } = notifSlice.actions;
export default notifSlice.reducer;
