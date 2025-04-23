import { createSlice } from "@reduxjs/toolkit";
import { createDeals, getAllDeals } from "../actions/dealsAction";

const dealsSlice = createSlice({
  name: "deals",
  initialState: {
    deals: [],
    dealDetails: null,
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearDealState: (state) => {
      state.deals = [];
      state.count = 0;
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
      });
  },
});
export const { clearDealState } = dealsSlice.actions;
export default dealsSlice.reducer;