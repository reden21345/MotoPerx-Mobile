import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import notifReducer from './slices/notifSlice';
import authReducer from './slices/authSlice';
import pointsReducer from './slices/pointSlice';
import dealsReducer from './slices/dealSlice';
import qrCodeReducer from './slices/qrSlice';
import badgesReducer from './slices/badgeSlice';
import partnerReducer from './slices/partnerSlice';
import productReducer from './slices/producSlice';
import gearReducer from './slices/gearSlice';

export const store = configureStore({
  reducer: {
    admins: adminReducer,
    auth: authReducer,
    points: pointsReducer,
    deals: dealsReducer,
    qrCode: qrCodeReducer,
    badges: badgesReducer,
    partners: partnerReducer,
    notifications: notifReducer,
    products: productReducer,
    gears: gearReducer,
  },
});

export default store;