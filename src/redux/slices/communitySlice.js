import { createSlice } from "@reduxjs/toolkit";
import { 
    addMember,
    changeMemberRole,
    createCommunity,
    deleteCommunity,
    getCommunityById,
    removeMember,
    updateCommunity,
    updateStatus,   
    getCommunitiesForUser,
    joinCommunity
 } from "../actions/communityAction";

const communitySlice = createSlice({
  name: "communities",
  initialState: {
    communities: [],
    joinedCommunities: [],
    createdCommunities: [],
    community: null,
    message: null,
    nearby: null,
    count: 0,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCommunityState: (state) => {
      state.error = null;
      state.message = null;
      state.communities = [];
      state.joinedCommunities = [];
      state.createdCommunities = [];
      state.community = null;
      state.count = 0;
      state.success = false;
    },
    clearMessage: (state) => {
      state.error = null;
      state.success = false;
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

      .addCase(getCommunitiesForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommunitiesForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload.communities;
        state.count = action.payload.count;
        state.joinedCommunities = action.payload.joinedCommunities;
        state.createdCommunities = action.payload.createdCommunities;
      })
      .addCase(getCommunitiesForUser.rejected, (state, action) => {
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
        state.error = action.payload;
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

      .addCase(joinCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(joinCommunity.rejected, (state, action) => {
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
