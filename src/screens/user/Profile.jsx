import React, { useEffect, useState } from "react";
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
  Switch,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getUserPoints } from "../../redux/actions/pointsAction";
import { profile } from "../../redux/actions/authAction";
import { getQRCode } from "../../redux/actions/qrcodeAction";



const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loyaltyTier, lifetimePoints, loading, error } = useSelector(
    (state) => state.points
  );
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(profile());
    dispatch(getQRCode());
    dispatch(getUserPoints()).finally(() => setRefreshing(false));
  };

  const handleCopyReferralCode = () => {
    if (user?.referralCode) {
      Clipboard.setStringAsync(user.referralCode);
      Alert.alert("Copied", "Referral code copied to clipboard.");
    }
  };

  const currentPoints = lifetimePoints || 0;
  let maxPoints = 500;

  // Tier Color Mapping
  let tierColor = "#000";
  switch (loyaltyTier?.toLowerCase()) {
    case "bronze":
      tierColor = "#cd7f32";
      break;
    case "silver":
      tierColor = "#C0C0C0";
      break;
    case "gold":
      tierColor = "#FFD700";
      break;
    case "platinum":
      tierColor = "#E5E4E2";
      break;
    default:
      tierColor = "#98DB52"; // Default green
  }


  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#98DB52"
          style={{ flex: 1, justifyContent: "center" }}
        />
      ) : (
        <>
          {/* Header */}
         <View style={[styles.profileHeader, { backgroundColor: tierColor }]}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    user && user.avatar && user.avatar.url
                      ? user.avatar.url
                      : "https://via.placeholder.com/150",
                }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{user?.name}</Text>
              {/* {loyaltyTier && (
                <View style={[styles.badge, { backgroundColor: tierColor }]}>
                  <Text style={styles.badgeText}>{loyaltyTier.toUpperCase()}</Text>
                </View>
              )} */}
            </View>
          </View>

          {/* Info Rows */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PHONE</Text>
            <Text style={styles.infoValue}>{user?.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>EMAIL</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          {/* Points Card */}
          <View style={styles.pointsCard}>
            <View style={styles.referralRow}>
              <Text style={styles.referralLabel}>REFERRAL CODE:</Text>
              <Text style={styles.referralCode}>{user?.referralCode || "N/A"}</Text>
              <TouchableOpacity onPress={handleCopyReferralCode}>
                <Ionicons name="copy-outline" size={18} color="#000" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>

            <Text style={styles.pointsLabel}>POINTS: {currentPoints}</Text>

            <View style={styles.progressWrapper}>
              <Text style={styles.progressNumber}>0</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(currentPoints / maxPoints, 1) * 100}%`,
                      backgroundColor: tierColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressNumber}>{maxPoints}</Text>
            </View>
          </View>

          {/* Actions */}
          {/* <View style={styles.actionItem}>
            <Ionicons name="moon-outline" size={20} />
            <Text style={styles.actionText}>DARK MODE</Text>
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode((prev) => !prev)}
              style={{ marginLeft: "auto" }}
            />
          </View> */}

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("MyGears")}
          >
            <Ionicons name="settings-outline" size={20} />
            <Text style={styles.actionText}>MY GEARS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("MyDeals")}
          >
            <Ionicons name="pricetag-outline" size={20} />
            <Text style={styles.actionText}>REDEEMED DEALS</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 5,
    width: "100%",
  },
  avatarWrapper: {
    backgroundColor: "#ccc",
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 4,
  },
  infoLabel: {
    color: "#888",
    fontWeight: "bold",
  },
  infoValue: {
    color: "#000",
    fontWeight: "bold",
  },
  pointsCard: {
    width: "90%",
    borderRadius: 12,
    borderColor: "#000",
    borderWidth: 1,
    padding: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  progressWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressNumber: {
    fontSize: 12,
    color: "#000",
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#eee",
    marginHorizontal: 8,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  actionText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  referralRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  referralLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginRight: 6,
  },
  referralCode: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Profile;

