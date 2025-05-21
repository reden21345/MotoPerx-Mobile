import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotifications } from "../redux/actions/notifAction";

const Notifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unseen, loading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (user) {
      dispatch(getUserNotifications());
    }
  }, [user, dispatch]);

  if (error) {
    Alert.alert("Error", error);
  }

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  const renderItem = ({ item }) => {
    const isUnseen = !item.seen;

    return (
      <View
        style={[
          styles.notificationItem,
          isUnseen && styles.unseenNotification,
        ]}
      >
        <Text style={[styles.title, isUnseen && styles.unseenTitle]}>
          {item.title}
        </Text>
        <Text style={[styles.body, isUnseen && styles.unseenBody]}>
          {item.body}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications available.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  notificationItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  unseenNotification: {
    backgroundColor: "#e6f7ff",
  },
  title: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 4,
    color: "#333",
  },
  body: {
    fontSize: 14,
    color: "#555",
  },
  unseenTitle: {
    fontWeight: "bold",
    color: "#000",
  },
  unseenBody: {
    fontWeight: "bold",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Notifications;
