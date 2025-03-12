import { createSlice } from '@reduxjs/toolkit';
import { getQRCode } from '../actions/qrcodeAction';

const qrCodeSlice = createSlice({
    name: 'qrCode',
    initialState: {
        qrCode: {},
        loading: false,
        error: null,
    },
    reducers: {},
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
            });
    },
});

export default qrCodeSlice.reducer;