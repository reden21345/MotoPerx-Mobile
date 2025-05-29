import { createSlice } from "@reduxjs/toolkit";
import { createGears, getAllGears, getUserGear, updateGear, deleteGear } from "../actions/gearAction";

const gearSlice = createSlice({
  name: "gears",
  initialState: {
    gears: [],
    gearDetails: {},
    count: 0,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearGearSlice: (state) => {
      state.gears = [];
      state.gearDetails = null,
      state.count = 0;
      state.success = false;
      state.error = null;
    },
    clearSuccess : (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllGears.fulfilled, (state, action) => {
        state.loading = false;
        state.gears = action.payload.gears;
        state.count = action.payload.count;
      })
      .addCase(getAllGears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGears.fulfilled, (state, action) => {
        state.loading = false;
        state.gearDetails = action.payload.gear;
      })
      .addCase(createGears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGear.fulfilled, (state, action) => {
        state.loading = false;
        state.gearDetails = action.payload.gear;
      })
      .addCase(updateGear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteGear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGear.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(deleteGear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getUserGear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserGear.fulfilled, (state, action) => {
        state.loading = false;
        state.gearDetails = action.payload.gear;
      })
      .addCase(getUserGear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearGearSlice, clearSuccess } = gearSlice.actions;
export default gearSlice.reducer;