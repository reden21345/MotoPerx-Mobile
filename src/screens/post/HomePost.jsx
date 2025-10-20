import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  getHomePosts,
  deletePost,
  likePost,
} from "../../redux/actions/postAction";
import { clearMessage, clearSuccess } from "../../redux/slices/postSlice";
import { clearCommentSuccess } from "../../redux/slices/commentSlice";
import { styles } from "../../styles/HomePostStyles";

import WhatsOnMind from "../../components/posts/WhatsOnMind";
import CreatePostModal from "../../components/posts/CreatePost";
import PostItem from "../../components/posts/PostItem";
import EditPost from "../../components/posts/EditPost";
import CommentModal from "../../components/posts/CommentModal";

const HomePost = ({ navigation }) => {
  const dispatch = useDispatch();
  const { homePosts, loading, error, message, success } = useSelector(
    (state) => state.posts
  );
  const { successComment } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [postId, setPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [localLikeCounts, setLocalLikeCounts] = useState({});

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getHomePosts()).finally(() => setRefreshing(false));
    dispatch(clearSuccess());
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (homePosts?.length && user?._id) {
      const likedSet = new Set();
      const likeCounts = {};

      homePosts.forEach((post) => {
        const isLiked = post.likes?.some((like) => like.user === user._id);
        if (isLiked) likedSet.add(post._id);
        likeCounts[post._id] = post.likes?.length || 0;
      });

      setLikedPosts(likedSet);
      setLocalLikeCounts(likeCounts);
    }
  }, [homePosts, user]);

  const handleLike = (postId) => {
    setLikedPosts((prevLiked) => {
      const newSet = new Set(prevLiked);
      const alreadyLiked = newSet.has(postId);

      // Update local like count in parallel
      setLocalLikeCounts((prevCounts) => {
        const newCounts = { ...prevCounts };
        newCounts[postId] = (newCounts[postId] || 0) + (alreadyLiked ? -1 : 1);
        return newCounts;
      });

      // Toggle liked state
      if (alreadyLiked) newSet.delete(postId);
      else newSet.add(postId);

      return newSet;
    });

    // Dispatch async toggle to backend
    dispatch(likePost(postId));
  };

  const handleComment = (postId) => {
    setPostId(postId);
    setShowAddComment(true);
  };

  const handleViewPost = (postId) => {
    navigation.navigate("PostDetails", { postId });
  };

  const toggleDropdown = (postId) => {
    setActiveDropdown(activeDropdown === postId ? null : postId);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditItem(null);
  };

  const handleDelete = (postId) => {
    setActiveDropdown(null);
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(deletePost(postId));
          Alert.alert("Success", "Post deleted successfully");
        },
      },
    ]);
  };

  const handleReport = (postId) => {
    setActiveDropdown(null);
    Alert.alert("Report Post", "Why are you reporting this post?", [
      { text: "Cancel", style: "cancel" },
      { text: "Spam", onPress: () => submitReport(postId, "spam") },
      {
        text: "Inappropriate Content",
        onPress: () => submitReport(postId, "inappropriate"),
      },
      { text: "Harassment", onPress: () => submitReport(postId, "harassment") },
    ]);
  };

  const submitReport = (postId, reason) => {
    // Dispatch report action
    // dispatch(reportPost({ postId, reason }));
    Alert.alert("Thank you", "Your report has been submitted");
  };

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleCommunityPress = () => {
    navigation.navigate("UsersCommunities");
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  useEffect(() => {
    if (success) {
      dispatch(getHomePosts());
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (successComment) {
      dispatch(getHomePosts());
      dispatch(clearCommentSuccess());
      setShowAddComment(false);
    }
  }, [successComment, dispatch]);

  useEffect(() => {
    if (message) {
      Alert.alert("Success", message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  const renderPost = ({ item }) => (
    <PostItem
      item={item}
      user={user}
      likedPosts={likedPosts}
      localLikeCounts={localLikeCounts}
      activeDropdown={activeDropdown}
      onLike={handleLike}
      onComment={handleComment}
      onViewPost={handleViewPost}
      onToggleDropdown={toggleDropdown}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onReport={handleReport}
      onCloseDropdown={closeDropdown}
    />
  );

  return (
    <View style={styles.container}>
      <WhatsOnMind
        onPress={handleCreatePost}
        onCommunityPress={handleCommunityPress}
      />

      <FlatList
        data={homePosts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1DA1F2"]}
            tintColor="#1DA1F2"
          />
        }
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={closeDropdown}
      />

      <CreatePostModal visible={showCreateModal} onClose={closeCreateModal} />

      <EditPost
        visible={showEditModal}
        onClose={closeEditModal}
        item={editItem}
      />

      <CommentModal
        visible={showAddComment}
        onClose={() => setShowAddComment(false)}
        postId={postId}
        editingComment={null}
      />
    </View>
  );
};

export default HomePost;
