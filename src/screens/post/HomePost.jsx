import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getHomePosts } from "../../redux/actions/postAction";
import { clearMessage, clearSuccess } from "../../redux/slices/postSlice";
import { styles } from "../../styles/HomePostStyles";

import WhatsOnMind from "../../components/posts/WhatsOnMind";
import CreatePostModal from "../../components/posts/CreatePost";
import PostItem from "../../components/posts/PostItem";
import EditPost from "../../components/posts/EditPost";

const HomePost = () => {
  const dispatch = useDispatch();
  const { homePosts, loading, error, message } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getHomePosts()).finally(() => setRefreshing(false));
    dispatch(clearSuccess());
    dispatch(clearMessage());
  };

  const handleLike = (postId) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    // Here you can dispatch an action to update likes on server
    // dispatch(likePost(postId));
  };

  const handleComment = (postId) => {
    // Navigate to comments or open comment modal
    Alert.alert("Comments", "Open comments for this post");
  };

  const handleShare = (postId) => {
    Alert.alert("Share", "Share this post");
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
          // Dispatch delete action
          // dispatch(deletePost(postId));
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

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      Alert.alert("Success", message);
    }
  }, [message]);

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
      activeDropdown={activeDropdown}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
      onToggleDropdown={toggleDropdown}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onReport={handleReport}
      onCloseDropdown={closeDropdown}
    />
  );

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={closeDropdown}
    >
      <WhatsOnMind onPress={openCreateModal} />

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
      />

      <CreatePostModal visible={showCreateModal} onClose={closeCreateModal} />

      {/* Add the EditPost modal */}
      <EditPost
        visible={showEditModal}
        onClose={closeEditModal}
        item={editItem}
      />
    </TouchableOpacity>
  );
};

export default HomePost;
