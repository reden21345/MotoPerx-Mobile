import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";
import CommunityHeader from "../../components/communities/CommunityHeader";
import CommunityCover from "../../components/communities/CommunityCover";
import CommunityInfo from "../../components/communities/CommunityInfo";
import CommunityTabs from "../../components/communities/CommunityTabs";
import PostsTab from "../../components/communities/PostsTab";
import MembersTab from "../../components/communities/MembersTab";
import AboutTab from "../../components/communities/AboutTab";
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

  // Handler functions
  const handleCreatePost = () => {
    // Navigate to create post screen
    console.log("Create post");
  };

  const handleInvite = () => {
    // Navigate to invite screen
    console.log("Invite members");
  };

  const handleJoin = () => {
    // Join or request to join community
    console.log("Join community");
  };

  const handleLike = (post) => {
    // Handle like post
    console.log("Like post", post._id);
  };

  const handleComment = (post) => {
    // Navigate to post comments
    console.log("Comment on post", post._id);
  };

  const handleShare = (post) => {
    // Share post
    console.log("Share post", post._id);
  };

  const handleRemoveMember = (member) => {
    // Remove member from community
    console.log("Remove member", member.user?._id);
  };

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

  // Loading state
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

  const approvedMembers = community.members?.filter((m) => m.isApproved) || [];

  // Check if current user is a member of the community
  const isMember =
    community.creator?._id === user?._id ||
    approvedMembers.some((member) => member.user?._id === user?._id);

  // Determine if user can view posts
  const canViewPosts = !community.isPrivate || isMember;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
      <CommunityHeader
        onBack={() => navigation.goBack()}
        onMore={() => console.log("More options")}
      />

      <ScrollView style={styles.scrollView}>
        <CommunityCover communityName={community.name} />

        <CommunityInfo
          community={community}
          approvedMembersCount={approvedMembers.length}
          isMember={isMember}
          onCreatePost={handleCreatePost}
          onInvite={handleInvite}
          onJoin={handleJoin}
        />

        <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <View style={styles.tabContent}>
          {activeTab === "posts" && (
            <PostsTab
              canViewPosts={canViewPosts}
              posts={community.posts}
              user={user}
              onRequestJoin={handleJoin}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          )}

          {activeTab === "members" && (
            <MembersTab
              members={approvedMembers}
              currentUserId={user?._id}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {activeTab === "about" && <AboutTab community={community} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunityDetails;
