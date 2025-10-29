import { createSlice } from "@reduxjs/toolkit";
import {
  saveReactionTime,
  getUserReactionGames,
  getReactionLeaderboard,
  getQuizQuestions,
  submitQuizAnswers,
  getUserQuizHistory,
  getQuizLeaderboard,
  getFuelChallenge,
  submitFuelChallenge,
  getUserFuelHistory,
  getFuelLeaderboard,
  getUserFuelStats,
} from "../actions/gameAction";

const gameSlice = createSlice({
  name: "games",
  initialState: {
    reactionRecords: null,
    reactionLeaderboard: null,
    quizQuestions: null,
    quizHistory: null,
    quizLeaderboard: null,
    quizResult: null,
    fuelChallenge: null,
    fuelResult: null,
    fuelHistory: null,
    fuelLeaderboard: null,
    userBestScore: null,
    weekStart: null,
    pagination: null,
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

      // Fuel Game Slices
      .addCase(getFuelChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFuelChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelChallenge = action.payload.challenge;
        state.success = action.payload.success;
      })
      .addCase(getFuelChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitFuelChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFuelChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.fuelResult = action.payload.result;
        state.success = action.payload.success;
      })
      .addCase(submitFuelChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserFuelHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFuelHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelHistory = action.payload.history;
        state.pagination = action.payload.pagination;
        state.success = action.payload.success;
      })
      .addCase(getUserFuelHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFuelLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFuelLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.weekStart = action.payload.weekStart;
        state.fuelLeaderboard = action.payload.leaderboard;
        state.userBestScore = action.payload.currentUser;
        state.success = action.payload.success;
      })
      .addCase(getFuelLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserFuelStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFuelStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userFuelStats = action.payload.stats || action.payload;
        state.success = action.payload.success;
      })
      .addCase(getUserFuelStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearMessage, clearGameState } = gameSlice.actions;
export default gameSlice.reducer;
