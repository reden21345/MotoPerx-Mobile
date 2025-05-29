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
import { profile } from "../../redux/actions/authAction";
import { MaterialIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { Animated, Dimensions } from "react-native";
import { formatDate } from "../../utils/helpers";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { qrCode } = useSelector((state) => state.qrCode);
  const { loyaltyTier,lifetimePoints,loading, error } = useSelector(
    (state) => state.points
  );
  const [modalVisible, setModalVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiList, setConfettiList] = useState([]);
  const isBirthdayToday = (birthday) => {
  const today = new Date();
  const bday = new Date(birthday);
  return (
    today.getDate() === bday.getDate() &&
    today.getMonth() === bday.getMonth()
  );
};


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

  const currentPoints = lifetimePoints || 0;

    let tierColor = "#cd7f32"; // Default Bronze
    let maxPoints = 999;

    if (currentPoints >= 5000) {
      tierColor = "#ffd700"; // Gold
      maxPoints = 6000;
    } else if (currentPoints >= 1000) {
      tierColor = "#c0c0c0"; // Silver
      maxPoints = 5000;
    }

    useEffect(() => {
      const today = new Date();
      const bday = new Date(user?.birthday);
      
      if (
        today.getDate() === bday.getDate() &&
        today.getMonth() === bday.getMonth()
      ) {
        launchConfetti();
      }
    }, [user]);

    const launchConfetti = () => {
      const screenWidth = Dimensions.get("window").width;
      const colors = ["#ff0", "#f0f", "#0ff", "#f90", "#0f0"];
      let confetti = [];

      for (let i = 0; i < 30; i++) {
        const animation = new Animated.Value(0);
        confetti.push({ 
          id: i, 
          left: Math.random() * screenWidth, 
          color: colors[Math.floor(Math.random() * colors.length)], 
          animation 
        });

        Animated.timing(animation, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true
        }).start();
      }

      setConfettiList(confetti);
      setShowConfetti(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
    };



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
          <TouchableOpacity
            style={styles.gearIcon}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="settings-outline" size={28} color="#98DB52" />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <Image 
                  source={{
                    uri:
                      user && user.avatar && user.avatar.url
                        ? user.avatar.url
                        : "https://via.placeholder.com/150",
                  }} 
                  style={styles.avatar} />
              </View>

              {/* User Info */}
              <View style={styles.infoContainer}>
                {isBirthdayToday(user?.birthday) && (
                    <View style={styles.confettiRow}>
                      <Text style={styles.happyBirthdayText}>Happy Birthday!🎂</Text>
                    </View>
                  )}
                <Text style={styles.username}>{user?.name}</Text>
                <Text style={styles.infoText}>{user?.email}</Text>
                <Text style={styles.infoText}>{user?.phone}</Text>
                <View style={styles.birthdayContainer}>
                  <Text style={styles.infoText}>
                    {new Date(user?.birthday).toLocaleDateString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    }).replace(/, /g, ", ")}
                  </Text>

                  
                </View>
              </View>

              {/* Gear Icon */}
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="settings-outline" size={28} color="#000" />
              </TouchableOpacity>
            </View>

         <View style={[styles.card, { borderColor: tierColor }]}>
                <TouchableOpacity
                  style={styles.referralRow}
                  onPress={handleCopyReferralCode}
                  activeOpacity={0.7}
                >
                  <Text style={styles.referralLabel}>Referral Code:</Text>
                  <Text style={styles.referralCode}>{user?.referralCode || "N/A"}</Text>
                  <Ionicons name="copy-outline" size={18} color="#98DB52" style={{ marginLeft: 5 }} />
                </TouchableOpacity>

                {/* <Text style={styles.userPoints}>Points: {currentPoints.toFixed(2)}</Text> */}
                <Text style={styles.userTier}>{loyaltyTier || "N/A"}</Text>

                <View style={styles.progressContainer}>
                  <Text style={{ color: "#fff" }}>0</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(currentPoints / maxPoints, 1) * 100}%`, backgroundColor: tierColor },
                      ]}
                    >
                      <Text style={styles.progressText}>{currentPoints} pts</Text>
                    </View>
                  </View>
                  <Text style={{ color: "#fff" }}>{maxPoints}</Text>
                </View>

                <MaterialIcons
                  name="workspace-premium"
                  size={28}
                  color={tierColor}
                  style={styles.tierIcon}
                />
          </View>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("MyGears")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="build-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.historyButtonText}>My Gears</Text>
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

          {modalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("EditProfile", { user });
                }}
              >
                <Text style={styles.modalButtonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("EditPassword");
                }}
              >
                <Text style={styles.modalButtonText}>Edit Password</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
          {qrCode?.code && user?._id === qrCode?.user ? (
            <QRCode
              key={qrCode.code}
              value={qrCode.code.toString()}
              size={150}
              color='#98DB52'
              backgroundColor='transparent'
            />
          ) : (
            <Text>No QR Code available</Text>
          )}
        </>
      )}
      {showConfetti &&
        confettiList.map((item) => {
          const translateY = item.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, Dimensions.get("window").height + 50],
          });

          return (
            <Animated.View
              key={item.id}
              style={{
                position: "absolute",
                top: 0,
                left: item.left,
                width: 8,
                height: 12,
                backgroundColor: item.color,
                borderRadius: 2,
                transform: [{ translateY }],
                zIndex: 999,
              }}
            />
          );
        })}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
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
    borderColor: "#98DB52",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  userPoints: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#98DB52",
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
    backgroundColor: "#98DB52",
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
    color: "#fff",
    fontWeight: "500",
    marginRight: 6,
  },
  referralCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#98DB52",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 15,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    shadowColor: "#FFFFFF",           
    shadowOffset: { width: 2, height: 8 }, 
    shadowOpacity: 0.75,             
    shadowRadius: 12,             
    elevation: 15,    
  },
  historyButtonText: {
    color: "#76A51D",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#98DB52",
    position: "relative",
  },
  referralRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userTier: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 20,
    backgroundColor: "#333",
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tierIcon: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 5,
  },
  progressText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  gearIcon: {
  position: "absolute",
  top: 40,
  right: 20,
  zIndex: 10,
},

modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100,
},

modalContainer: {
  backgroundColor: "#1a1a1a",
  padding: 20,
  borderRadius: 10,
  width: "80%",
  alignItems: "center",
},

modalButton: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: "#98DB52",
  borderRadius: 8,
  marginVertical: 8,
  width: "100%",
  alignItems: "center",
},

modalButtonText: {
  color: "#000",
  fontWeight: "600",
  fontSize: 16,
},

closeText: {
  color: "#fff",
  marginTop: 10,
  textDecorationLine: "underline",
},

profileContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 20,
},

avatarContainer: {
  marginRight: 15,
  borderColor: "#98DB52",
  borderWidth: 2,
  borderRadius: 50,
  overflow: "hidden",
},

avatar: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: "#ddd", // fallback color
},

infoContainer: {
  flex: 1,
},

username: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 6,
  color: "#fff",
},

infoText: {
  fontSize: 14,
  marginBottom: 2,
  color: "#fff",
},
happyBirthdayText: {
  fontSize: 15,
  marginLeft: 2,
  fontWeight: "600",
  color: "#e91e63",
},

});

export default Profile;
