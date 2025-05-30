import { createSlice } from "@reduxjs/toolkit";
import { deletePartner, deleteUser, editUser, getAllPartners, getAllUsers } from "../actions/adminAction";

const amdinSlice = createSlice({
  name: "admins",
  initialState: {
    users: [],
    partners: [],
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
      });
  },
});
export const { clearAdminState, clearSuccess } = amdinSlice.actions;
export default amdinSlice.reducer;
