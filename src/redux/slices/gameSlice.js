import { createSlice } from "@reduxjs/toolkit";
import {
  saveReactionTime,
  getUserReactionGames,
  getReactionLeaderboard,
} from "../actions/gameAction";

const gameSlice = createSlice({
  name: "games",
  initialState: {
    reactionRecords: null,
    reactionLeaderboard: null,
    message: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearGameState: (state) => {
      state.reactionRecords = null;
      state.reactionLeaderboard = null;
      state.message = null;
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveReactionTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveReactionTime.fulfilled, (state, action) => {
        state.loading = false;
        state.reactionRecords = action.payload.data;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(saveReactionTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserReactionGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserReactionGames.fulfilled, (state, action) => {
        state.loading = false;
        state.reactionRecords = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(getUserReactionGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getReactionLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReactionLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.reactionLeaderboard = action.payload.leaderboard;
        state.success = action.payload.success;
      })
      .addCase(getReactionLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearMessage, clearGameState } = gameSlice.actions;
export default gameSlice.reducer;
