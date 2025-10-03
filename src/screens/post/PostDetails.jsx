import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";
import CreateComment from "../../components/posts/CreateComment";
import { useSelector, useDispatch } from "react-redux";
import { getComments } from "../../redux/actions/commentAction";

const PostDetails = ({ route, navigation }) => {
  const { postId } = route.params;
  const dispatch = useDispatch();
  const { postDetails, loading, error } = useSelector(
    (state) => state.comments
  );

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const isLiked = likedPosts.has(postDetails?._id);
  const likesCount = (postDetails?.likes?.length || 0) + (isLiked ? 1 : 0);

  useEffect(() => {
    if (postId) {
      dispatch(getComments(postId));
    }
  }, [dispatch, postId]);

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

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderImage = ({ item, index }) => (
    <View style={styles.imageSlide}>
      <Image
        source={{ uri: item.url }}
        style={styles.postImage}
        resizeMode="cover"
      />
    </View>
  );

  const renderImageIndicators = () => {
    if (!postDetails?.images || postDetails.images.length <= 1) return null;

    return (
      <View style={styles.indicatorContainer}>
        {postDetails.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentImageIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentAvatar}>
        {item.createdBy?.avatar?.url ? (
          <Image
            source={{ uri: item.createdBy.avatar.url }}
            style={styles.commentAvatarImage}
          />
        ) : (
          <Text style={styles.commentAvatarText}>
            {item.createdBy?.name?.charAt(0).toUpperCase() || "?"}
          </Text>
        )}
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.commentUserName}>
          {item.createdBy?.name || "Anonymous"}
        </Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    </View>
  );

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
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

  // Show loading or empty states
  if (loading || !postDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            {postDetails.createdBy?.avatar?.url ? (
              <Image
                source={{ uri: postDetails.createdBy.avatar.url }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {postDetails.createdBy?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {postDetails.createdBy?.name || "Anonymous"}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(postDetails.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.contentSection}>
          {postDetails.title && (
            <Text style={styles.postTitle}>{postDetails.title}</Text>
          )}
          <Text style={styles.postCaption}>{postDetails.caption}</Text>
        </View>

        {/* Images */}
        {postDetails.images && postDetails.images.length > 0 && (
          <View style={styles.imageSection}>
            <FlatList
              ref={flatListRef}
              data={postDetails.images}
              renderItem={renderImage}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
            />
            {renderImageIndicators()}
          </View>
        )}

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
              {isLiked ? "❤️" : "🤍"}
            </Text>
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {likesCount}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>
              {postDetails.comments?.length || 0}
            </Text>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            Comments ({postDetails.comments?.length || 0})
          </Text>
          {postDetails.comments && postDetails.comments.length > 0 ? (
            postDetails.comments.map((comment) => (
              <View key={comment._id}>{renderComment({ item: comment })}</View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          )}
        </View>

        {/* Add Comment */}
        <TouchableOpacity
          style={styles.addCommentButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addCommentText}>Add a comment...</Text>
        </TouchableOpacity>
      </ScrollView>

      <CreateComment
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        postId={postDetails._id}
      />
    </SafeAreaView>
  );
};

export default PostDetails;