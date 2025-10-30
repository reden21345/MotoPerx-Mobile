import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";
import CommentModal from "../../components/posts/CommentModal";
import PostHeader from "../../components/posts/PostHeader";
import UserInfoSection from "../../components/posts/UserInfoSection";
import ImageCarousel from "../../components/posts/ImageCarousel";
import ActionBar from "../../components/posts/ActionBar";
import CommentsSection from "../../components/posts/CommentsSection";
import EditPost from "../../components/posts/EditPost";
import DropdownAction from "../../components/DropdownAction";
import { useSelector, useDispatch } from "react-redux";
import { getComments, deleteComment } from "../../redux/actions/commentAction";
import { clearCommentSuccess } from "../../redux/slices/commentSlice";
import {
  getHomePosts,
  likePost,
  deletePost,
} from "../../redux/actions/postAction";

const PostDetails = ({ route, navigation }) => {
  const { postId } = route.params;
  const dispatch = useDispatch();

  const { postDetails, loading, error, commentSuccess } = useSelector(
    (state) => state.comments
  );
  const { user } = useSelector((state) => state.auth);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const isOwner = String(user?._id) === String(postDetails?.createdBy?._id);

  useEffect(() => {
    if (postDetails && user?._id) {
      const isLiked = postDetails.likes?.some((like) => like.user === user._id);
      setLiked(isLiked);
      setLikeCount(postDetails.likes?.length || 0);
      setEditPost(postDetails);
    }
  }, [postDetails, user]);

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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getComments(postId));
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLike = () => {
    setLiked((prevLiked) => {
      const newLiked = !prevLiked;
      setLikeCount((prevCount) => prevCount + (newLiked ? 1 : -1));
      dispatch(likePost(postDetails._id));
      return newLiked;
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

  const handleDeletePost = () => {
    setActiveDropdown(false);
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(deletePost(postId)).then(() => {
            navigation.goBack();
          });
          Alert.alert("Success", "Post deleted successfully");
        },
      },
    ]);
  };

  const handleEditPost = () => {
    setShowEditPost(true);
    setActiveDropdown(null);
  };

  const closeEditPost = () => {
    setShowEditPost(false);
  };

  const closeCommentModal = () => {
    setShowAddModal(false);
    setEditingComment(null);
  };

  const toggleDropdown = () => {
    if (activeDropdown) setActiveDropdown(false);
    else setActiveDropdown(true);
  };

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
        onBack={() => {
          dispatch(getHomePosts());
          navigation.goBack();
        }}
        onMore={() => toggleDropdown()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
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

        <DropdownAction
          visible={activeDropdown}
          isOwner={isOwner}
          onEdit={() => handleEditPost()}
          onDelete={() => handleDeletePost()}
          onReport={() => console.log("Report Post")}
        />

        <ActionBar
          isLiked={liked}
          likesCount={likeCount}
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

      <EditPost
        visible={showEditPost}
        onClose={closeEditPost}
        item={editPost}
      />

      <CommentModal
        visible={showAddModal}
        onClose={closeCommentModal}
        postId={postDetails._id}
        editingComment={editingComment}
      />
    </SafeAreaView>
  );
};

export default PostDetails;
