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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getApprovedCommunities } from "../../redux/actions/communityAction";
import { clearMessage } from "../../redux/slices/communitySlice";
import { communitiesStyles as styles } from "../../styles/CommunitiesStyles";
import { getInitials } from "../../utils/helpers";

const Communities = ({ navigation }) => {
  const dispatch = useDispatch();
  const { communities, loading, error, message, success } = useSelector(
    (state) => state.communities
  );
  const [refreshing, setRefreshing] = useState(false);
  console.log("Data:", communities);
  useEffect(() => {
    dispatch(getApprovedCommunities());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getApprovedCommunities()).finally(() => setRefreshing(false));
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (success) {
      dispatch(getApprovedCommunities());
      dispatch(clearMessage());
    }
  }, [success, dispatch]);

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

  const renderCommunityCard = ({ item }) => {
    const memberCount = item.members?.length || 0;
    const postCount = item.posts?.length || 0;
    const isPrivate = item.isPrivate;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("CommunityDetails", { communityId: item._id })
        }
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            {item.avatar ? (
              <Image 
                source={{ uri: item.avatar?.url }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
              </View>
            )}
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.communityName} numberOfLines={1}>
                {item.name}
              </Text>
              {isPrivate && (
                <View style={styles.privateBadge}>
                  <Text style={styles.privateBadgeText}>🔒 Private</Text>
                </View>
              )}
            </View>

            <Text 
              style={styles.description} 
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{memberCount}</Text>
            <Text style={styles.statLabel}>
              {memberCount === 1 ? "Member" : "Members"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{postCount}</Text>
            <Text style={styles.statLabel}>
              {postCount === 1 ? "Post" : "Posts"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.creatorLabel}>Privacy</Text>
            <Text style={styles.creatorName} numberOfLines={1}>
              {isPrivate ? "Private" : "Public"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🏘️</Text>
      <Text style={styles.emptyTitle}>No Communities Yet</Text>
      <Text style={styles.emptyDescription}>
        Communities that are approved will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={communities}
          renderItem={renderCommunityCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Communities;