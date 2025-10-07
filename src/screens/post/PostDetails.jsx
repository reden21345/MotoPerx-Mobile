import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";
import CommentModal from "../../components/posts/CommentModal";
import PostHeader from "../../components/posts/PostHeader";
import UserInfoSection from "../../components/posts/UserInfoSection";
import ImageCarousel from "../../components/posts/ImageCarousel";
import ActionBar from "../../components/posts/ActionBar";
import CommentsSection from "../../components/posts/CommentsSection";
import { useSelector, useDispatch } from "react-redux";
import { getComments, deleteComment } from "../../redux/actions/commentAction";
import { clearCommentSuccess } from "../../redux/slices/commentSlice";

const PostDetails = ({ route, navigation }) => {
  const { postId } = route.params;
  const dispatch = useDispatch();
  const { postDetails, loading, error, commentSuccess } = useSelector(
    (state) => state.comments
  );
  const { user } = useSelector((state) => state.auth);

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  const isLiked = likedPosts.has(postDetails?._id);
  const likesCount = (postDetails?.likes?.length || 0) + (isLiked ? 1 : 0);

  useEffect(() => {
    if (postId) {
      dispatch(getComments(postId));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (commentSuccess) {
      dispatch(getComments(postId)).then(() => {
        dispatch(clearCommentSuccess());
      });
    }
  }, [dispatch, postId, commentSuccess]);

  const handleLike = () => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postDetails._id)) {
        newSet.delete(postDetails._id);
      } else {
        newSet.add(postDetails._id);
      }
      return newSet;
    });
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setShowAddModal(true);
  };

  const handleDeleteComment = (commentId) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteComment(commentId));
            Alert.alert("Success", "Comment deleted successfully");
          },
        },
      ]
    );
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingComment(null);
  };

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <PostHeader onBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Post</Text>
          <Text style={styles.errorMessage}>
            {error.message || error || "Something went wrong"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(getComments(postId))}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading || !postDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <PostHeader onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {loading ? "Loading..." : "No post data available"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <PostHeader
        onBack={() => navigation.goBack()}
        onMore={() => console.log("More options")}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <UserInfoSection
          createdBy={postDetails.createdBy}
          createdAt={postDetails.createdAt}
        />

        <View style={styles.contentSection}>
          {postDetails.title && (
            <Text style={styles.postTitle}>{postDetails.title}</Text>
          )}
          <Text style={styles.postCaption}>{postDetails.caption}</Text>
        </View>

        <ImageCarousel images={postDetails.images} />

        <ActionBar
          isLiked={isLiked}
          likesCount={likesCount}
          commentsCount={postDetails.comments?.length || 0}
          onLike={handleLike}
        />

        <CommentsSection
          comments={postDetails.comments}
          currentUserId={user?._id}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
        />

        <TouchableOpacity
          style={styles.addCommentButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addCommentText}>Add a comment...</Text>
        </TouchableOpacity>
      </ScrollView>

      <CommentModal
        visible={showAddModal}
        onClose={handleCloseModal}
        postId={postDetails._id}
        editingComment={editingComment}
      />
    </SafeAreaView>
  );
};

export default PostDetails;