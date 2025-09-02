import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getHomePosts } from "../../redux/actions/postAction";
import { clearMessage, clearSuccess } from "../../redux/slices/postSlice";
import { styles } from "../../styles/HomePostStyles";

const HomePost = () => {
  const dispatch = useDispatch();
  const { homePosts, loading, error, message } = useSelector(
    (state) => state.posts
  );
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getHomePosts()).finally(() => setRefreshing(false));
    dispatch(clearSuccess());
    dispatch(clearMessage());
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  if (message) {
    Alert.alert("Success", message);
  }

  const renderPost = ({ item }) => {
    const isLiked = likedPosts.has(item._id);
    const likesCount = (item.likes?.length || 0) + (isLiked ? 1 : 0);

    return (
      <View style={styles.postContainer}>
        {/* Header */}
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.author?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.username}>
                {item.author?.username || 'Anonymous'}
              </Text>
              {item.isCommunity && item.communityName && (
                <Text style={styles.communityName}>in {item.communityName}</Text>
              )}
              <Text style={styles.timestamp}>2h ago</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreText}>⋯</Text>
          </TouchableOpacity> 
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          {item.title && (
            <Text style={styles.postTitle}>{item.title}</Text>
          )}
          <Text style={styles.postCaption}>{item.caption}</Text>
        </View>

        {/* Images */}
        {item.images?.length > 0 && (
          <View style={styles.imageContainer}>
            {item.images.length === 1 ? (
              <Image 
                source={{ uri: item.images[0].url }} 
                style={styles.singleImage} 
                resizeMode="cover"
              />
            ) : (
              <FlatList
                data={item.images}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(img, index) => index.toString()}
                renderItem={({ item: img }) => (
                  <Image 
                    source={{ uri: img.url }} 
                    style={styles.multipleImage} 
                    resizeMode="cover"
                  />
                )}
                style={styles.imageList}
              />
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item._id)}
          >
            <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleComment(item._id)}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>
              {item.comments?.length || 0}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleShare(item._id)}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={homePosts}
      keyExtractor={(item) => item._id}
      renderItem={renderPost}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={['#1DA1F2']}
          tintColor="#1DA1F2"
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};


export default HomePost;