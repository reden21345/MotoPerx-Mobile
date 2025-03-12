import { createSlice } from '@reduxjs/toolkit';
import { getUserPoints } from '../actions/pointsAction';

const pointsSlice = createSlice({
    name: 'points',
    initialState: {
        points: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserPoints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserPoints.fulfilled, (state, action) => {
                state.loading = false;
                state.points = action.payload.points;
            })
            .addCase(getUserPoints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default pointsSlice.reducer;