import { createSlice } from "@reduxjs/toolkit";
import {
  deletePartner,
  deleteUser,
  editUser,
  getAllPartners,
  getAllUsers,
  getAllCommunities
} from "../actions/adminAction";

const amdinSlice = createSlice({
  name: "admins",
  initialState: {
    users: [],
    partners: [],
    communities: [],
    count: 0,
    loading: false,
    message: null,
    success: false,
    error: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.users = [];
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
      })
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(editUser.rejected, (state, action) => {
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
      })
      .addCase(getAllPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload.partners;
      })
      .addCase(getAllPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.count;
        state.communities = action.payload.communities;
      })
      .addCase(getAllCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearAdminState, clearSuccess } = amdinSlice.actions;
export default amdinSlice.reducer;
