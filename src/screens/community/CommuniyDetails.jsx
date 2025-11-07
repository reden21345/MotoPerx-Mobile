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
import AddMember from "../../components/communities/AddMember";
import ChangeRole from "../../components/communities/ChangeRole";
import EditCommunity from "../../components/communities/EditCommunity";
import CreatePost from "../../components/posts/CreatePost";
import EditPost from "../../components/posts/EditPost";
import CommentModal from "../../components/posts/CommentModal";
import ReportPostModal from "../../components/posts/ReportPost";
import { likePost } from "../../redux/actions/postAction";
import { useSelector, useDispatch } from "react-redux";
import {
  getCommunityById,
  deleteCommunity,
  getCommunitiesForUser,
  removeMember,
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
  const [showAddMember, setShowAddMember] = useState(false);
  const [showChangeRole, setChangeRole] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [memberRoleChange, setMemberRoleChange] = useState(null);

  //Post related states
  const [postDropdown, setPostDropdown] = useState(null);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [showReportPost, setShowReportPost] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [postId, setPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [localLikeCounts, setLocalLikeCounts] = useState({});

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

  useEffect(() => {
    if (community?.posts?.length && user?._id) {
      const likedSet = new Set();
      const likeCounts = {};

      community?.posts?.forEach((post) => {
        const isLiked = post.likes?.some((like) => like.user === user._id);
        if (isLiked) likedSet.add(post._id);
        likeCounts[post._id] = post.likes?.length || 0;
      });

      setLikedPosts(likedSet);
      setLocalLikeCounts(likeCounts);
    }
  }, [community?.posts, user]);

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getCommunityById(communityId));
    } catch (error) {
      console.error("Error refreshing community:", error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, communityId]);

  const handleBack = () => {
    navigation.goBack();
    dispatch(getCommunitiesForUser());
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleInvite = () => {
    setShowAddMember(true);
  };

  const handleChangeMemberRole = (member) => {
    setMemberRoleChange(member);
    setChangeRole(true);
    console.log("Change role for member", member);
  };

  const handleJoin = () => {
    // Join or request to join community
    console.log("Join community");
  };

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

      if (alreadyLiked) newSet.delete(postId);
      else newSet.add(postId);

      return newSet;
    });

    dispatch(likePost(postId));
  };

  const handleComment = (postId) => {
    setPostId(postId);
    setShowAddComment(true);
  };

  const handleViewPost = (postId) => {
    navigation.navigate("PostDetails", { postId });
  };

  const togglePostDropdown = (postId) => {
    setPostDropdown(postDropdown === postId ? null : postId);
  };

  const handleEditPost = (item) => {
    setEditPost(item);
    setShowEditPost(true);
    setPostDropdown(null);
  };

  const handleDeletePost = (postId) => {
    setPostDropdown(null);
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

  const handleRemoveMember = (member) => {
    Alert.alert(
      "Remove member",
      "Are you sure you want to remove this member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            dispatch(removeMember({ communityId, userId: member.user?._id }));
            Alert.alert("Success", "Member removed successfully");
          },
        },
      ]
    );
  };

  const handleEditCommunity = () => {
    setShowEditCommunity(true);
    setActiveDropdown(false);
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

  const handleReport = (postId) => {
    setPostDropdown(null);
    setPostId(postId);
    setShowReportPost(true);
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

  const isAdmin = community.members.some(
    (m) => m.user?._id === user?._id && m.role === "Moderator"
  );

  const canModify = isOwner || isAdmin;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a73e8" />
      <CommunityHeader
        onBack={() => handleBack()}
        onMore={() => toggleDropdown()}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1a73e8"]}
            tintColor="#1a73e8"
          />
        }
      >
        <CommunityCover
          communityName={community.name}
          avatar={community.avatar}
        />

        <CommunityInfo
          community={community}
          approvedMembersCount={approvedMembers.length}
          isMember={isMember}
          isPendingMember={isPendingMember}
          canAddMembers={canModify}
          onCreatePost={handleCreatePost}
          onInvite={handleInvite}
          onJoin={handleJoin}
          onViewReports={() =>
            navigation.navigate("CommunityReports", { communityId })
          }
        />

        <DropdownAction
          visible={activeDropdown}
          isOwner={isOwner}
          onEdit={() => handleEditCommunity()}
          onDelete={() => handleDeleteCommunity()}
          onReport={() => console.log("Report Community")}
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
              postDropdown={postDropdown}
              likedPosts={likedPosts}
              localLikeCounts={localLikeCounts}
              onLike={handleLike}
              onComment={handleComment}
              onViewPost={handleViewPost}
              onToggleDropdown={togglePostDropdown}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onReport={handleReport}
              onCloseDropdown={() => setActiveDropdown(false)}
              isCommunity={true}
            />
          )}

          {activeTab === "members" && (
            <MembersTab
              members={approvedMembers}
              currentUserId={user?._id}
              canRemove={canModify}
              isOwner={isOwner}
              onRemoveMember={handleRemoveMember}
              onChangeRole={handleChangeMemberRole}
            />
          )}

          {activeTab === "about" && <AboutTab community={community} />}
        </View>
      </ScrollView>

      <CreatePost
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        community={community}
      />

      <AddMember
        visible={showAddMember}
        onClose={() => setShowAddMember(false)}
        communityId={communityId}
        isOwner={isOwner}
      />

      <ChangeRole
        visible={showChangeRole}
        onClose={() => setChangeRole(false)}
        communityId={communityId}
        member={memberRoleChange}
      />

      <EditCommunity
        visible={showEditCommunity}
        community={community}
        onClose={() => setShowEditCommunity(false)}
      />

      <EditPost
        visible={showEditPost}
        onClose={() => setShowEditPost(false)}
        item={editPost}
      />

      <CommentModal
        visible={showAddComment}
        onClose={() => setShowAddComment(false)}
        postId={postId}
        editingComment={null}
      />

      <ReportPostModal
        visible={showReportPost}
        onClose={() => setShowReportPost(false)}
        postId={postId}
      />
    </SafeAreaView>
  );
};

export default CommunityDetails;
