import { createSlice } from "@reduxjs/toolkit";
import { getUserBadges } from "../actions/badgesAction";

const badgesSlice = createSlice({
  name: "badges",
  initialState: {
    badges: [],
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearBadgeState: (state) => {
      state.badges = [];
      state.count = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserBadges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = action.payload.badges;
        state.count = action.payload.count;
      })
      .addCase(getUserBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearBadgeState } = badgesSlice.actions;
export default badgesSlice.reducer;
