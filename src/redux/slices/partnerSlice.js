import { createSlice } from "@reduxjs/toolkit";
import { addEmployee, apply, getNearbyPartners, getPartner, removeEmployee, updateStatus } from "../actions/partnerAction";

const partnerSlice = createSlice({
  name: "partners",
  initialState: {
    partner: null,
    message: null,
    nearby: null,
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearPartnerState: (state) => {
      state.error = null;
      state.message = null;
      state.partner = null;
      state.count = 0;
    },
    clearMessage: (state) => {
      state.error = null;
      state.message = null;
    },
    clearPartnerDetails: (state) => {
      state.error = null;
      state.partner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(apply.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.partner = action.payload.partner;
      })
      .addCase(apply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getPartner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.partner = action.payload.partner;
      })
      .addCase(getPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(removeEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getNearbyPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNearbyPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload.count;
        state.nearby = action.payload.partners;
      })
      .addCase(getNearbyPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearPartnerState, clearMessage, clearPartnerDetails } = partnerSlice.actions;
export default partnerSlice.reducer;
