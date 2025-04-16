import { createSlice } from "@reduxjs/toolkit";
import { apply, getPartner } from "../actions/partnerAction";

const partnerSlice = createSlice({
  name: "partners",
  initialState: {
    partner: null,
    message: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPartnerState: (state) => {
      state.error = null;
      state.message = null;
      state.partner = null;
    },
    clearMessage: (state) => {
      state.error = null;
      state.message = null;
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
      });
  },
});
export const { clearPartnerState, clearMessage } = partnerSlice.actions;
export default partnerSlice.reducer;
