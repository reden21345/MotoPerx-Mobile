import { createSlice } from "@reduxjs/toolkit";
import { deleteUser, getAllUsers } from "../actions/adminAction";

const amdinSlice = createSlice({
  name: "admins",
  initialState: {
    users: [],
    count: 0,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.users = [];
      state.count = 0;
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
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearAdminState } = amdinSlice.actions;
export default amdinSlice.reducer;
