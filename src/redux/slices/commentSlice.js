import { createSlice } from "@reduxjs/toolkit";
import { 
    addComment,
    getComments,
    updateComment,
    deleteComment
} from "../actions/commentAction";

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    postDetails: null,
    commentDetails: null,
    count: 0,
    message: null,
    loading: false,
    commentSuccess: false,
    error: null,
  },
  reducers: {
    clearCommentState: (state) => {
      state.postDetails = null;
      state.commentDetails = null;
      state.count = 0;
      state.commentSuccess = false;
      state.error = null;
    },
    clearMessage: (state) => {
      state.commentSuccess = false;
      state.message = null;
    },
    clearCommentSuccess: (state) => {
      state.commentSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.postDetails = action.payload.post;
        state.count = action.payload.count;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.postDetails = action.payload.post;
        state.message = action.payload.message;
        state.commentSuccess = action.payload.success;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.commentSuccess = action.payload.success;
        state.commentDetails = action.payload.comment;
        state.message = action.payload.message;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.commentSuccess = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { clearCommentState, clearCommentSuccess, clearMessage } =
  commentSlice.actions;
export default commentSlice.reducer;
