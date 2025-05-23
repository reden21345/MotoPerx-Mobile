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
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { getUserPoints } from "../../redux/actions/pointsAction";
import { getQRCode } from "../../redux/actions/qrcodeAction";
import { profile } from "../../redux/actions/authAction";
import QRCode from "react-native-qrcode-svg";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { qrCode } = useSelector((state) => state.qrCode);
  const { points, loyaltyTier, loading, error } = useSelector(
    (state) => state.points
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(profile());
    dispatch(getUserPoints()).finally(() => setRefreshing(false));
  };

  const handleCopyReferralCode = () => {
    if (user?.referralCode) {
      Clipboard.setStringAsync(user.referralCode);
      Alert.alert("Copied", "Referral code copied to clipboard.");
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

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
          color="#FF5B00"
          style={{ flex: 1, justifyContent: "center" }}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.edit}
            onPress={() => navigation.navigate("EditProfile", { user })}
          >
            <Ionicons name="create-outline" size={28} color="#FF5B00" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editPassword}
            onPress={() => navigation.navigate("EditPassword")}
          >
            <Ionicons name="lock-closed-outline" size={28} color="#FF5B00" />
          </TouchableOpacity>

          <Image
            source={{
              uri:
                user && user.avatar && user.avatar.url
                  ? user.avatar.url
                  : "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userEmail}>Phone: {user?.phone || "N/A"}</Text>
          <Text style={styles.userRole}>Role: {user?.role}</Text>
          <Text style={styles.userPoints}>
            Points: {(points || 0).toFixed(2)}
          </Text>
          <Text style={styles.userPoints}>Tier: {loyaltyTier || "N/A"}</Text>
          <TouchableOpacity
            style={styles.referralContainer}
            onPress={handleCopyReferralCode}
            activeOpacity={0.7}
          >
            <Text style={styles.referralLabel}>Referral Code:</Text>
            <Text style={styles.referralCode}>
              {user?.referralCode || "N/A"}
            </Text>
            <Ionicons
              name="copy-outline"
              size={18}
              color="#FF5B00"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("History")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="time-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("MyDeals")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="pricetag-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.historyButtonText}>Redeemed Deals</Text>
          </TouchableOpacity>

          {qrCode?.code && user?._id === qrCode?.user ? (
            <QRCode
              key={qrCode.code}
              value={qrCode.code.toString()}
              size={150}
            />
          ) : (
            <Text>No QR Code available</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#FF5B00",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  userPoints: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5B00",
    marginBottom: 20,
  },
  edit: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  editPassword: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  qrCodeImage: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#FF5B00",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 15,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  referralContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#e6f0ff",
    padding: 10,
    borderRadius: 8,
  },
  referralLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginRight: 6,
  },
  referralCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5B00",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  historyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },  
});

export default Profile;
