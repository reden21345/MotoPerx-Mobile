import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";
import CommunityHeader from "../../components/communities/CommunityHeader";
import { useSelector, useDispatch } from "react-redux";
import { getCommunityById } from "../../redux/actions/communityAction";
import { clearMessage } from "../../redux/slices/communitySlice";

const CommunityDetails = ({ route, navigation }) => {
  const { communityId } = route.params;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("posts");
  
  const { community, loading, error, success } = useSelector(
    (state) => state.communities
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (communityId) {
      dispatch(getCommunityById(communityId));
    }
  }, [dispatch, communityId]);

  useEffect(() => {
    if (success) {
      dispatch(clearMessage());
    }
  }, [dispatch, success]);

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <CommunityHeader onBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Community</Text>
          <Text style={styles.errorMessage}>
            {error.message || error || "Something went wrong"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(getCommunityById(communityId))}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading || !community) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <CommunityHeader onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {loading ? "Loading..." : "No community data available"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderPost = ({ item }) => {
    const isLiked = item.likes?.some(like => like.user === user?._id);
    const likesCount = item.likes?.length || 0;
    const commentsCount = item.comments?.length || 0;

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image
            source={{
              uri: item.createdBy?.avatar?.url || "https://via.placeholder.com/40",
            }}
            style={styles.postAvatar}
          />
          <View style={styles.postHeaderInfo}>
            <Text style={styles.postAuthor}>{item.createdBy?.name || "Anonymous"}</Text>
            <Text style={styles.postTime}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity style={styles.postMenuButton}>
            <Text style={styles.postMenuIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {item.title && (
          <Text style={styles.postTitle}>{item.title}</Text>
        )}
        
        <Text style={styles.postContent}>{item.caption}</Text>
        
        {item.images && item.images.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.imageScrollContainer}
          >
            {item.images.map((image, index) => (
              <Image 
                key={index}
                source={{ uri: image.url }} 
                style={[
                  styles.postImage,
                  item.images.length > 1 && styles.postImageMultiple
                ]} 
              />
            ))}
          </ScrollView>
        )}

        {item.link && (
          <TouchableOpacity style={styles.linkPreview}>
            <Text style={styles.linkIcon}>🔗</Text>
            <Text style={styles.linkText} numberOfLines={1}>{item.link}</Text>
          </TouchableOpacity>
        )}

        {(likesCount > 0 || commentsCount > 0) && (
          <View style={styles.postStats}>
            {likesCount > 0 && (
              <Text style={styles.postStatsText}>
                👍 {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </Text>
            )}
            {commentsCount > 0 && (
              <Text style={styles.postStatsText}>
                💬 {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
              </Text>
            )}
          </View>
        )}

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
              {isLiked ? '👍' : '👍'} Like
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>💬 Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>↗️ Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberCard}>
      <Image
        source={{
          uri: item.user?.avatar?.url || "https://via.placeholder.com/50",
        }}
        style={styles.memberAvatar}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.user?.name || "Unknown"}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
        <Text style={styles.memberJoinDate}>
          Joined {new Date(item.joinedAt).toLocaleDateString()}
        </Text>
      </View>
      {item.role !== "Admin" && user?._id !== item.user?._id && (
        <TouchableOpacity style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const approvedMembers = community.members?.filter(m => m.isApproved) || [];
  
  // Check if current user is a member of the community
  const isMember = approvedMembers.some(
    member => member.user?._id === user?._id
  );
  
  // Determine if user can view posts
  const canViewPosts = !community.isPrivate || isMember;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
      <CommunityHeader onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollView}>
        {/* Cover Section */}
        <View style={styles.coverSection}>
          <View style={styles.coverGradient}>
            <View style={styles.communityIconContainer}>
              <Text style={styles.communityIcon}>
                {community.name?.charAt(0).toUpperCase() || "C"}
              </Text>
            </View>
          </View>
        </View>

        {/* Community Info */}
        <View style={styles.infoSection}>
          <Text style={styles.communityName}>{community.name}</Text>
          <Text style={styles.communityDescription}>
            {community.description}
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{approvedMembers.length}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{community.posts?.length || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statBadge}>
                {community.isPrivate ? "🔒 Private" : "🌐 Public"}
              </Text>
            </View>
          </View>

          <View style={styles.creatorInfo}>
            <Text style={styles.creatorLabel}>Created by </Text>
            <Text style={styles.creatorName}>{community.creator?.name}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {isMember ? (
              <>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>
                    ➕ Create Post
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Invite</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>
                  {community.isPrivate ? "🔒 Request to Join" : "➕ Join Community"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "posts" && styles.activeTab]}
            onPress={() => setActiveTab("posts")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "posts" && styles.activeTabText,
              ]}
            >
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "members" && styles.activeTab]}
            onPress={() => setActiveTab("members")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "members" && styles.activeTabText,
              ]}
            >
              Members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.activeTabText,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "posts" && (
            <>
              {!canViewPosts ? (
                <View style={styles.restrictedState}>
                  <Text style={styles.restrictedIcon}>🔒</Text>
                  <Text style={styles.restrictedTitle}>Private Community</Text>
                  <Text style={styles.restrictedText}>
                    This is a private community. You need to join to see posts.
                  </Text>
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Request to Join</Text>
                  </TouchableOpacity>
                </View>
              ) : community.posts && community.posts.length > 0 ? (
                <FlatList
                  data={community.posts}
                  renderItem={renderPost}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>📝</Text>
                  <Text style={styles.emptyStateText}>No posts yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Be the first to share something!
                  </Text>
                </View>
              )}
            </>
          )}

          {activeTab === "members" && (
            <>
              {approvedMembers.length > 0 ? (
                <FlatList
                  data={approvedMembers}
                  renderItem={renderMember}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>👥</Text>
                  <Text style={styles.emptyStateText}>No members yet</Text>
                </View>
              )}
            </>
          )}

          {activeTab === "about" && (
            <View style={styles.aboutContainer}>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Status</Text>
                <Text style={styles.aboutValue}>{community.status}</Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Privacy</Text>
                <Text style={styles.aboutValue}>
                  {community.isPrivate ? "Private Community" : "Public Community"}
                </Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Created</Text>
                <Text style={styles.aboutValue}>
                  {new Date(community.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.aboutItem}>
                <Text style={styles.aboutLabel}>Description</Text>
                <Text style={styles.aboutDescription}>
                  {community.description}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunityDetails;