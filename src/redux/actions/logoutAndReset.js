import { logoutUser } from './authAction';
import { clearAuthState } from '../slices/authSlice';
import { clearBadgeState } from '../slices/badgeSlice';
import { clearDealState } from '../slices/dealSlice';
import { clearPartnerState } from '../slices/partnerSlice';
import { clearPointState } from '../slices/pointSlice';
import { resetData } from '../slices/qrSlice';

export const logoutAndReset = () => async (dispatch) => {
  try {
    await dispatch(logoutUser()).unwrap();

    dispatch(clearAuthState());
    dispatch(clearBadgeState());
    dispatch(clearDealState());
    dispatch(clearPartnerState());
    dispatch(clearPointState());
    dispatch(resetData());
  } catch (error) {
    console.log('Logout failed:', error); 
  }
};

