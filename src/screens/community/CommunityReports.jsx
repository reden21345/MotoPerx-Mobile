import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getReportedPosts } from "../../redux/actions/communityAction";
import { clearMessage } from "../../redux/slices/communitySlice";
import { communityReports as styles } from "../../styles/CommunityReports";

const CommunityReports = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { communityId } = route.params;
  const { reportedPosts, loading, error, message } = useSelector(
    (state) => state.communities
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReports, setSelectedReports] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getReportedPosts(communityId)).finally(() => setRefreshing(false));
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (communityId) {
      dispatch(getReportedPosts(communityId));
    }
  }, [communityId, dispatch]);

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

  const handleDeletePost = (postId, postTitle) => {
    Alert.alert(
      "Delete Post",
      `Are you sure you want to delete "${postTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Dispatch your delete action here
            // dispatch(deletePost(postId, communityId));
            console.log("Deleting post:", postId);
          },
        },
      ]
    );
  };

  const handleViewPost = (postId) => {
    // Navigate to post details
    navigation.navigate("PostDetails", { postId });
  };

  const handleViewReports = (reports) => {
    setSelectedReports(reports);
    setModalVisible(true);
  };

  const renderReportItem = ({ item }) => {
    const reportCount = item.reports?.length || 0;
    const hasImage = item.images && item.images.length > 0;

    return (
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <TouchableOpacity
            style={styles.reportBadge}
            onPress={() => handleViewReports(item.reports)}
            activeOpacity={0.7}
          >
            <Ionicons name="flag" size={16} color="#ff6b6b" />
            <Text style={styles.reportCount}>
              {reportCount} Report{reportCount !== 1 ? "s" : ""}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#ff6b6b" />
          </TouchableOpacity>
          <Text style={styles.reportDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.postContent}
          onPress={() => handleViewPost(item._id)}
          activeOpacity={0.7}
        >
          <View style={styles.postHeader}>
            <View style={styles.authorInfo}>
              <Ionicons name="person-circle" size={24} color="#666" />
              <Text style={styles.authorName}>{item.createdBy?.name}</Text>
            </View>
          </View>

          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postCaption} numberOfLines={3}>
            {item.caption}
          </Text>

          {hasImage && (
            <Image
              source={{ uri: item.images[0].url }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.postStats}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color="#666" />
              <Text style={styles.statText}>{item.likes?.length || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={16} color="#666" />
              <Text style={styles.statText}>{item.comments?.length || 0}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewPost(item._id)}
          >
            <Ionicons name="eye" size={18} color="#98DB52" />
            <Text style={styles.viewButtonText}>View Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePost(item._id, item.title)}
          >
            <Ionicons name="trash" size={18} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="shield-checkmark" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Reported Posts</Text>
      <Text style={styles.emptyMessage}>
        This community has no reported posts at the moment.
      </Text>
    </View>
  );

  const renderReportModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.reportsScrollView}>
            {selectedReports?.map((report, index) => (
              <View key={index} style={styles.reportDetailCard}>
                <View style={styles.reportDetailHeader}>
                  <View style={styles.reporterInfo}>
                    <Ionicons name="person-circle" size={20} color="#666" />
                    <Text style={styles.reporterName}>
                      {report.user?.name || "Anonymous"}
                    </Text>
                  </View>
                  <Text style={styles.reportDetailDate}>
                    {new Date(report.reportedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reportText}>{report.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#98DB52" />
        <Text style={styles.loadingText}>Loading reported posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reported Posts</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={reportedPosts}
        renderItem={renderReportItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#98DB52"]}
            tintColor="#98DB52"
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {renderReportModal()}
    </View>
  );
};

export default CommunityReports;