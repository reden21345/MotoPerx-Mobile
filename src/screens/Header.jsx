import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { getHomePosts } from "../redux/actions/postAction";
import { getCommunitiesForUser } from "../redux/actions/communityAction";
import Notifications from "./Notifications";

const Header = ({ navigation }) => {
  const dispatch = useDispatch();
  const { expoPushToken } = useNotification();

  const { user } = useSelector((state) => state.auth);
  const { unseen } = useSelector((state) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const hasFetched = useRef(false);

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
      dispatch(getHomePosts());
      dispatch(getCommunitiesForUser());

      hasFetched.current = true;
    }
  }, [user, expoPushToken, dispatch]);

  return (
    <SafeAreaView style={{ backgroundColor: "#000" }} edges={["top"]}>
      <View style={styles.header}>
        {/* Left: User Info */}
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={{
              uri: user?.avatar?.url || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>
            {user?.name ? user.name.split(" ")[0] : ""}
          </Text>
        </TouchableOpacity>

        {/* Center: Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/Motoperx-logo-hor.png")}
            style={styles.logo}
          />
        </View>

        {/* Right: Notifications and Menu */}
        <View style={styles.iconGroup}>
          <TouchableOpacity
            onPress={() => setShowNotifications(true)}
            style={styles.notifContainer}
          >
            <Ionicons name="notifications-outline" size={28} color="#000" />
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
            <Ionicons name="menu" size={32} color="#000" />
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
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#000", // subtle gray line
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    flex: 1, // center alignment
  },
  logo: {
    width: 250,
    height: 50,
    marginLeft: 20,
    marginBottom: 15,
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
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: -30,
  },
  profileImage: {
    width: 40, // slightly larger if preferred
    height: 40,
    borderRadius: 20,
    //marginBottom: 4, // space between image and text
    backgroundColor: "#ccc",
    borderColor: "#98DB52",
    borderWidth: 1,
    marginTop: 8,
  },
  userName: {
    color: "#000", // green
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
});
