import { createSlice } from '@reduxjs/toolkit';
import { getUserBadges } from '../actions/badgesAction';

const badgesSlice = createSlice({
    name: 'badges',
    initialState: {
        badges: [],
        count: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserBadges.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserBadges.fulfilled, (state, action) => {
                state.loading = false;
                state.badges = action.payload.badges;
                state.count = action.payload.count;
            })
            .addCase(getUserBadges.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default badgesSlice.reducer;