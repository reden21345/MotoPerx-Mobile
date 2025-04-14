import { createSlice } from '@reduxjs/toolkit';
import { earnPoints, getUserPoints } from '../actions/pointsAction';

const pointsSlice = createSlice({
    name: 'points',
    initialState: {
        points: 0,
        givenPoints: 0,
        message: '',
        loading: false,
        error: null,
    },
    reducers: {
        resetGivenPoints: (state) => {
            state.givenPoints = 0;
            state.message = '';
        },
    },
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
            })
            .addCase(earnPoints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(earnPoints.fulfilled, (state, action) => {
                state.loading = false;
                state.givenPoints = action.payload.points;
                state.message = action.payload.message;
            })
            .addCase(earnPoints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const {resetGivenPoints} = pointsSlice.actions;
export default pointsSlice.reducer;