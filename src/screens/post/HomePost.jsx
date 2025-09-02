import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getHomePosts } from "../../redux/actions/postAction";
import { clearMessage, clearSuccess } from "../../redux/slices/postSlice";

const HomePost = () => {
  const dispatch = useDispatch();
  const { homePosts, loading, error, message } = useSelector(
    (state) => state.posts
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getHomePosts()).finally(() => setRefreshing(false));
    dispatch(clearSuccess());
    dispatch(clearMessage());
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Failed", error);
  }

  if (message) {
    Alert.alert("Success", message);
  }

  const renderPost = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Community Name if it's a community post */}
        {item.isCommunity && item.communityName && (
          <Text style={styles.communityName}>{item.communityName}</Text>
        )}

        {/* Post Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Post Caption */}
        <Text style={styles.caption}>{item.caption}</Text>

        {/* Images */}
        {item.images?.length > 0 && (
          <FlatList
            data={item.images}
            horizontal
            keyExtractor={(img, index) => index.toString()}
            renderItem={({ item: img }) => (
              <Image source={{ uri: img.url }} style={styles.image} />
            )}
            style={styles.imageList}
          />
        )}

        {/* Likes & Comments */}
        <View style={styles.meta}>
          <Text style={styles.metaText}>{item.likes?.length || 0} Likes</Text>
          <Text style={styles.metaText}>
            {item.comments?.length || 0} Comments
          </Text>
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  communityName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  imageList: {
    marginBottom: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 8,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
});

export default HomePost;