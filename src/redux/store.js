import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pointsReducer from './slices/pointSlice';
import dealsReducer from './slices/dealSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    points: pointsReducer,
    deals: dealsReducer,
  },
});

export default store;