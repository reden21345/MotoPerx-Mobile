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
import { useFocusEffect } from "@react-navigation/native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";
import CommunityHeader from "../../components/communities/CommunityHeader";
import CommunityCover from "../../components/communities/CommunityCover";
import CommunityInfo from "../../components/communities/CommunityInfo";
import CommunityTabs from "../../components/communities/CommunityTabs";
import PostsTab from "../../components/communities/PostsTab";
import MembersTab from "../../components/communities/MembersTab";
import AboutTab from "../../components/communities/AboutTab";
import DropdownAction from "../../components/DropdownAction";
import EditCommunity from "../../components/communities/EditCommunity";
import { useSelector, useDispatch } from "react-redux";
import {
  getCommunityById,
  deleteCommunity,
  getCommunitiesForUser,
} from "../../redux/actions/communityAction";
import {
  clearMessage,
  clearCommunityData,
} from "../../redux/slices/communitySlice";

const CommunityDetails = ({ route, navigation }) => {
  const { communityId } = route.params;
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("posts");
  const [showEditCommunity, setShowEditCommunity] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);

  const { community, loading, error, success } = useSelector(
    (state) => state.communities
  );
  const { user } = useSelector((state) => state.auth);
  console.log(community);
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

  useFocusEffect(
    React.useCallback(() => {
      if (communityId) {
        dispatch(getCommunityById(communityId));
      }

      return () => {
        dispatch(clearCommunityData());
      };
    }, [dispatch, communityId])
  );

  const handleBack = () => {
    navigation.goBack();
    dispatch(getCommunitiesForUser());
  };
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

  const handleEditCommunity = () => {
    setShowEditCommunity(true);
    setActiveDropdown(false);
  };

  const closeEditCommunity = () => {
    setShowEditCommunity(false);
  };

  const toggleDropdown = () => {
    if (activeDropdown) setActiveDropdown(false);
    else setActiveDropdown(true);
  };

  const handleDeleteCommunity = () => {
    setActiveDropdown(false);
    Alert.alert(
      "Delete Community",
      "Are you sure you want to delete this community?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteCommunity(communityId)).then(() => {
              navigation.goBack();
            });
            Alert.alert("Success", "Community deleted successfully");
          },
        },
      ]
    );
  };

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

  // Variable checkings:
  const approvedMembers = community.members?.filter((m) => m.isApproved) || [];

  const isMember =
    community.creator?._id === user?._id ||
    approvedMembers.some((member) => member.user?._id === user?._id);

  const isPendingMember = community.members?.some(
    (member) => member.user?._id === user?._id && !member.isApproved
  );

  const canViewPosts = !community.isPrivate || isMember;

  const isOwner = String(user?._id) === String(community?.creator?._id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
      <CommunityHeader
        onBack={() => handleBack()}
        onMore={() => toggleDropdown()}
      />

      <ScrollView style={styles.scrollView}>
        <CommunityCover
          communityName={community.name}
          avatar={community.avatar}
        />

        <CommunityInfo
          community={community}
          approvedMembersCount={approvedMembers.length}
          isMember={isMember}
          isPendingMember={isPendingMember}
          onCreatePost={handleCreatePost}
          onInvite={handleInvite}
          onJoin={handleJoin}
        />

        <DropdownAction
          visible={activeDropdown}
          isOwner={isOwner}
          onEdit={() => handleEditCommunity()}
          onDelete={() => handleDeleteCommunity()}
          onReport={() => console.log("Report Post")}
        />

        <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <View style={styles.tabContent}>
          {activeTab === "posts" && (
            <PostsTab
              canViewPosts={canViewPosts}
              posts={community.posts}
              user={user}
              isPendingMember={isPendingMember}
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

      <EditCommunity
        visible={showEditCommunity}
        community={community}
        onClose={closeEditCommunity}
      />
    </SafeAreaView>
  );
};

export default CommunityDetails;
