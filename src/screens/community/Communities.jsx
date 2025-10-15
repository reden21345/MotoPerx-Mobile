import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getCommunitiesForUser } from "../../redux/actions/communityAction";
import { clearMessage } from "../../redux/slices/communitySlice";
import { communitiesStyles as styles } from "../../styles/CommunitiesStyles";
import CommunitiesCard from "../../components/communities/CommunitiesCard";
import FilterSection from "../../components/communities/FilterSection";

const Communities = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    communities,
    joinedCommunities,
    createdCommunities,
    loading,
    error,
    message,
    success,
  } = useSelector((state) => state.communities);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all");

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getCommunitiesForUser()).finally(() => setRefreshing(false));
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

  // Filter communities based on search and privacy
  const filteredCommunities = communities.filter((community) => {
    const matchesSearch = community.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesPrivacy =
      privacyFilter === "all" ||
      (privacyFilter === "public" && !community.isPrivate) ||
      (privacyFilter === "private" && community.isPrivate);

    return matchesSearch && matchesPrivacy;
  });

  // Determine community status for each community
  const getCommunityStatus = (communityId) => {
    if (createdCommunities.includes(communityId)) {
      return "creator";
    } else if (joinedCommunities.includes(communityId)) {
      return "joined";
    }
    return "available";
  };

  const renderCommunityCard = ({ item }) => {
    const status = getCommunityStatus(item._id);
    return (
      <CommunitiesCard
        item={item}
        navigation={navigation}
        status={status}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🏘️</Text>
      <Text style={styles.emptyTitle}>
        {searchQuery || privacyFilter !== "all"
          ? "No Communities Found"
          : "No Communities Yet"}
      </Text>
      <Text style={styles.emptyDescription}>
        {searchQuery || privacyFilter !== "all"
          ? "Try adjusting your search or filters"
          : "Communities that are approved will appear here"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar with Create Button */}
      <FilterSection
        navigation={navigation}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        setPrivacyFilter={setPrivacyFilter}
        privacyFilter={privacyFilter}
      />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={filteredCommunities}
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