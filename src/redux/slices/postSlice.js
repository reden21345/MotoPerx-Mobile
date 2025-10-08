import { createSlice } from "@reduxjs/toolkit";
import { 
    createPosts, 
    deletePost, 
    getHomePosts, 
    updatePost,
    likePost
} from "../actions/postAction";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [],
    homePosts: [],
    postDetails: null,
    count: 0,
    message: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearPostState: (state) => {
      state.allPosts = [];
      state.homePosts = [];
      state.count = 0;
      state.success = false;
      state.error = null;
      state.postDetails = null;
    },
    clearMessage: (state) => {
      state.success = false;
      state.message = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHomePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.homePosts = action.payload.homePosts;
        state.count = action.payload.count;
      })
      .addCase(getHomePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.postDetails = action.payload.post;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(createPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.postDetails = action.payload.post;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearPostState, clearSuccess, clearMessage } =
  postSlice.actions;
export default postSlice.reducer;
