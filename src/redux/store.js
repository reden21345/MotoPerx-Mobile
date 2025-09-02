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
import trackReducer from './slices/trackingSlice';
import postReducer from './slices/postSlice';
import communityReducer from './slices/communitySlice';

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
    tracks: trackReducer,
    posts: postReducer,
    communities: communityReducer,
  },
});

export default store;