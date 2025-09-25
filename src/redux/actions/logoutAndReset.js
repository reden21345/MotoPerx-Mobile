import { logoutUser } from './authAction';
import { clearAuthState } from '../slices/authSlice';
import { clearBadgeState } from '../slices/badgeSlice';
import { clearDealState } from '../slices/dealSlice';
import { clearPartnerState } from '../slices/partnerSlice';
import { clearPointState } from '../slices/pointSlice';
import { resetData } from '../slices/qrSlice';
import { clearAdminState } from '../slices/adminSlice';
import { clearNotifs } from '../slices/notifSlice';
import { clearProductState } from '../slices/producSlice';
import { clearTrackingState } from '../slices/trackingSlice';
import { clearPostState } from '../slices/postSlice';
import { clearCommentState } from '../slices/commentSlice';
import { clearCommunityState } from '../slices/communitySlice';

export const logoutAndReset = () => async (dispatch) => {
  try {
    await dispatch(logoutUser()).unwrap();

    dispatch(clearAdminState());
    dispatch(clearAuthState());
    dispatch(clearBadgeState());
    dispatch(clearDealState());
    dispatch(clearPartnerState());
    dispatch(clearPointState());
    dispatch(clearNotifs());
    dispatch(clearProductState());
    dispatch(clearTrackingState());
    dispatch(clearPostState());
    dispatch(clearCommentState());
    dispatch(clearCommunityState());
    dispatch(resetData());
  } catch (error) {
    console.log('Logout failed:', error); 
  }
};

