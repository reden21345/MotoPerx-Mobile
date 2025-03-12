import { createSlice } from '@reduxjs/toolkit';
import { getAllDeals } from '../actions/dealsAction';

const dealsSlice = createSlice({
    name: 'deals',
    initialState: {
        deals: [],
        count: 0,
        loading: false,
        error: null,
    },
    reducers: {},
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
            });
    },
});

export default dealsSlice.reducer;