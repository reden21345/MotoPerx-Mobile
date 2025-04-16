import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pointsReducer from './slices/pointSlice';
import dealsReducer from './slices/dealSlice';
import qrCodeReducer from './slices/qrSlice';
import badgesReducer from './slices/badgeSlice';
import partnerReducer from './slices/partnerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    points: pointsReducer,
    deals: dealsReducer,
    qrCode: qrCodeReducer,
    badges: badgesReducer,
    partners: partnerReducer,
  },
});

export default store;