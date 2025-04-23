import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { getUserPoints } from "../../redux/actions/pointsAction";
import { profile } from "../../redux/actions/authAction";

const MAX_POINTS = 500;
const TARGET_PERCENT = 50; // half-full

export default function Profile({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { points = 0, loading, error } = useSelector(
    (state) => state.points
  );

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(getUserPoints());
  }, [dispatch]);

  // animate to 50%
  useEffect(() => {
    Animated.timing(animValue, {
      toValue: TARGET_PERCENT,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    if (error) Alert.alert("Error", error);
  }, [error]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(profile());
    dispatch(getUserPoints()).finally(() => setRefreshing(false));
  };

  const history = [
    "Redeemed 10 pts",
    "Oil Change +50 pts",
    "Service Bonus +20 pts",
  ];

  const widthInterpolate = animValue.interpolate({
    inputRange: [0, MAX_POINTS],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="settings-outline" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <>
            {/* PROFILE HEADER */}
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Image
                  source={{
                    uri:
                      user?.avatar?.url ||
                      "https://via.placeholder.com/150",
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  <Text style={styles.userEmail}>
                    📞 {user?.phone || "N/A"}
                  </Text>
                </View>
              </View>
            </View>

            {/* POINTS BAR */}
            <View style={[styles.card, { marginTop: 20 }]}>
              <View style={styles.pointsRow}>
                <View style={styles.progressBackground}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { width: widthInterpolate },
                    ]}
                  />
                </View>
                <Text style={styles.pointsText}>
                  {points} / {MAX_POINTS}
                </Text>
                <Ionicons
                  name="medal-outline"
                  size={32}
                  color="#cd7f32"
                  style={{ marginLeft: 12 }}
                />
              </View>
            </View>

            {/* HISTORY */}
            <View style={[styles.card, { marginTop: 20 }]}>
              <Text style={styles.historyTitle}>📜 History</Text>
              {history.map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color="#007bff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.historyText}>{h}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* SETTINGS MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("EditProfile", { user });
              }}
            >
              <Text style={styles.modalButtonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("EditPassword");
              }}
            >
              <Text style={styles.modalButtonText}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ alignSelf: "center", marginTop: 8 }}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#eef2f5" },
  settingsButton: {
    position: "absolute",
    top: 40,
    right: 45,
    zIndex: 10,
  },
  container: { padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#4facfe",
  },
  userInfo: { marginLeft: 16 },
  userName: { fontSize: 20, fontWeight: "700", color: "#333" },
  userEmail: { fontSize: 14, color: "#666", marginTop: 4 },

  pointsRow: { flexDirection: "row", alignItems: "center" },
  progressBackground: {
    flex: 1,
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginRight: 12,
  },
  progressFill: {
    height: 12,
    backgroundColor: "#4facfe",
  },
  pointsText: { fontSize: 14, fontWeight: "600", color: "#333" },

  historyTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyText: { fontSize: 14, color: "#333" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  modalButton: {
    backgroundColor: "#4facfe",
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontSize: 16 },
  modalCloseText: { color: "#4facfe", fontSize: 16 },
});
