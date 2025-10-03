import { createSlice } from "@reduxjs/toolkit";
import { 
    addMember,
    changeMemberRole,
    createCommunity,
    deleteCommunity,
    getApprovedCommunities,
    getCommunityById,
    removeMember,
    updateCommunity,
    updateStatus
 } from "../actions/communityAction";

const communitySlice = createSlice({
  name: "communities",
  initialState: {
    communities: [],
    community: null,
    message: null,
    nearby: null,
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCommunityState: (state) => {
      state.error = null;
      state.message = null;
      state.communities = [];
      state.community = null;
      state.count = 0;
    },
    clearMessage: (state) => {
      state.error = null;
      state.message = null;
    },
    clearCommunityData: (state) => {
      state.error = null;
      state.community = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.community = action.payload.community;
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.community = action.payload.community;
      })
      .addCase(getCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getApprovedCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApprovedCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload.communities;
      })
      .addCase(getApprovedCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(removeMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changeMemberRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeMemberRole.fulfilled, (state, action) => {
        state.loading = false;
        state.community = action.payload.community;
        state.message = action.payload.message;
      })
      .addCase(changeMemberRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.community = action.payload.community;
        state.message = action.payload.message;
      })
      .addCase(updateCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deleteCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearCommunityState, clearMessage, clearCommunityData } =
  communitySlice.actions;
export default communitySlice.reducer;
