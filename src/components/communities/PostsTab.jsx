import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";
import PostCard from "./PostCard";

const PostsTab = ({
  canViewPosts,
  posts,
  user,
  isPendingMember,
  onRequestJoin,
  onLike,
  onComment,
  onShare,
}) => {
  if (!canViewPosts) {
    if (isPendingMember) {
      return (
        <View style={styles.restrictedState}>
          <Text style={styles.restrictedIcon}>⏳</Text>
          <Text style={styles.restrictedTitle}>Pending Approval</Text>
          <Text style={styles.restrictedText}>
            Your request to join is pending. Please wait for the community moderator
            to approve your membership.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.restrictedState}>
        <Text style={styles.restrictedIcon}>🔒</Text>
        <Text style={styles.restrictedTitle}>Private Community</Text>
        <Text style={styles.restrictedText}>
          This is a private community. You need to join to see posts.
        </Text>
        <TouchableOpacity style={styles.joinButton} onPress={onRequestJoin}>
          <Text style={styles.joinButtonText}>Request to Join</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>📝</Text>
        <Text style={styles.emptyStateText}>No posts yet</Text>
        <Text style={styles.emptyStateSubtext}>
          Be the first to share something!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostCard
          item={item}
          user={user}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
        />
      )}
      keyExtractor={(item) => item._id}
      scrollEnabled={false}
    />
  );
};

export default PostsTab;
