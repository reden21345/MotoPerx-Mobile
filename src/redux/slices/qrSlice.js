import { createSlice } from "@reduxjs/toolkit";
import { generateQRCode, getQRCode, getUserFromQr } from "../actions/qrcodeAction";

const qrCodeSlice = createSlice({
  name: "qrCode",
  initialState: {
    qrCode: {},
    data: {},
    loading: false,
    error: null,
  },
  reducers: {
    resetData: (state) => {
      state.data = {};
      state.qrCode = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQRCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQRCode.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCode = action.payload.qrCode;
      })
      .addCase(getQRCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserFromQr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFromQr.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getUserFromQr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(generateQRCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQRCode.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCode = action.payload.qrCode;
      })
      .addCase(generateQRCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const {resetData} = qrCodeSlice.actions;
export default qrCodeSlice.reducer;