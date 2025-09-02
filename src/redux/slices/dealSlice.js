import { createSlice } from "@reduxjs/toolkit";
import {
  createDeals,
  deleteDeal,
  getAllDeals,
  getRedeemedDeals,
  markDealAsUsed,
  updateDeals,
} from "../actions/dealsAction";

const dealsSlice = createSlice({
  name: "deals",
  initialState: {
    deals: [],
    dealDetails: null,
    redeemed: [],
    count: 0,
    message: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearDealState: (state) => {
      state.deals = [];
      state.redeemed = [];
      state.count = 0;
      state.success = false;
      state.error = null;
      state.dealDetails = null;
    },
    clearMessage: (state) => {
      state.success = false;
      state.message = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload.deals;
        state.count = action.payload.count;
      })
      .addCase(getAllDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.dealDetails = action.payload.deal;
      })
      .addCase(createDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.dealDetails = action.payload.deal;
      })
      .addCase(updateDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRedeemedDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRedeemedDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.redeemed = action.payload.deals;
        state.count = action.payload.count;
      })
      .addCase(getRedeemedDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markDealAsUsed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markDealAsUsed.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(markDealAsUsed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearDealState, clearSuccess, clearMessage } =
  dealsSlice.actions;
export default dealsSlice.reducer;
