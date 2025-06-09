import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import Sidebar from "../navigation/Sidebar";
import { useNotification } from "../hooks/NotificationContext";
import {
  getUserNotifications,
  notifChecker,
} from "../redux/actions/notifAction";
import { getQRCode } from "../redux/actions/qrcodeAction";
import { getUserPoints } from "../redux/actions/pointsAction";
import { getAllProducts } from "../redux/actions/productAction";
import { getAllDeals } from "../redux/actions/dealsAction";
import Notifications from "./Notifications";

const Header = ({ navigation }) => {
  const dispatch = useDispatch();
  const { expoPushToken } = useNotification();

  const { user } = useSelector((state) => state.auth);
  const { unseen } = useSelector((state) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const hasFetched = useRef(false); // prevent redundant fetches

  useEffect(() => {
    if (user && expoPushToken && !hasFetched.current) {
      const data = {
        userId: user._id,
        expoToken: expoPushToken,
      };
      dispatch(notifChecker(data));
      dispatch(getUserNotifications());
      dispatch(getQRCode());
      dispatch(getUserPoints());
      dispatch(getAllProducts());
      dispatch(getAllDeals());

      hasFetched.current = true;
    }
  }, [user, expoPushToken, dispatch]);

  return (
    <View>
      <View style={styles.header}>
        {/* Left: User Info */}
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: user?.avatar?.url || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Hi {user?.name}!</Text>
        </View>

        {/* Center: Logo */}
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/motoperx-logo.jpeg")} style={styles.logo} />
        </View>

        {/* Right: Notifications and Menu */}
        <View style={styles.iconGroup}>
          <TouchableOpacity
            onPress={() => setShowNotifications(true)}
            style={styles.notifContainer}
          >
            <Ionicons name="notifications-outline" size={28} color="#fff" />
            {unseen > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unseen}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSidebarOpen(true)}
            style={styles.menuIcon}
          >
            <Ionicons name="menu" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
      />

      <Notifications
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000000", // black
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // center alignment
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1, // aligns icons to the end
  },
  notifContainer: {
    marginRight: 16,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "red", // keeping red for visibility
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF", // white
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  menuIcon: {
    paddingLeft: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // so it takes available space
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#ccc",
    borderColor: "#98DB52", // green
    borderWidth: 1,
  },
  userName: {
    color: "#98DB52", // green
    fontSize: 16,
    fontWeight: "bold",
  },
});
