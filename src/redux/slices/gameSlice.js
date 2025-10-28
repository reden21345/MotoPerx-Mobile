import { createSlice } from "@reduxjs/toolkit";
import {
  saveReactionTime,
  getUserReactionGames,
  getReactionLeaderboard,
  getQuizQuestions,
  submitQuizAnswers,
  getUserQuizHistory,
  getQuizLeaderboard
} from "../actions/gameAction";

const gameSlice = createSlice({
  name: "games",
  initialState: {
    reactionRecords: null,
    reactionLeaderboard: null,
    quizQuestions: null,
    quizHistory: null,
    quizLeaderboard: null,
    weekStart: null,
    quizResult: null,
    count: null,
    message: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearGameState: (state) => {
      state.reactionRecords = null;
      state.reactionLeaderboard = null;
      state.quizQuestions = null;
      state.quizHistory = null;
      state.quizLeaderboard = null;
      state.weekStart = null;
      state.quizResult = null;
      state.count = null;
      state.success = false;
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
    // Reaction game slices
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
      })


      // Quiz game slices
      .addCase(getQuizQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.count = action.payload.count;
        state.success = action.payload.success;
      })
      .addCase(getQuizQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.quizResult = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserQuizHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserQuizHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.count;
        state.quizHistory = action.payload.history;
        state.success = action.payload.success;
      })
      .addCase(getUserQuizHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getQuizLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.weekStart = action.payload.weekStart;
        state.quizLeaderboard = action.payload.leaderboard;
        state.success = action.payload.success;
      })
      .addCase(getQuizLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});
export const { clearMessage, clearGameState } = gameSlice.actions;
export default gameSlice.reducer;
