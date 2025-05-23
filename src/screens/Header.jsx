import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import Sidebar from "../navigation/Sidebar";
import { useNotification } from "../hooks/NotificationContext";
import { getUserNotifications, notifChecker } from "../redux/actions/notifAction";
import { getQRCode } from "../redux/actions/qrcodeAction";
import { getUserPoints } from "../redux/actions/pointsAction";
import { getAllProducts } from "../redux/actions/productAction";

const Header = ({ navigation }) => {
  const dispatch = useDispatch();
  const { expoPushToken } = useNotification();

  const { user } = useSelector((state) => state.auth);
  const { unseen } = useSelector((state) => state.notifications);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const data = {
        userId: user?._id,
        expoToken: expoPushToken,
      };
      dispatch(notifChecker(data));
      dispatch(getUserNotifications());
    }
  }, [user, expoPushToken, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getQRCode());
      dispatch(getUserPoints());
      dispatch(getAllProducts());
    }
  }, [user, dispatch]);

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
              source={{
                        uri:
                        user && user.avatar && user.avatar.url
                          ? user.avatar.url
                          : "https://via.placeholder.com/150",
                      }}
              style={styles.profileImage}
          />
    
          <Text style={styles.userName}>Hi {user?.name}!</Text>
        </View>

        <View style={styles.iconGroup}>
          {/* Notification Icon with Badge */}
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.notifContainer}>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
            {unseen > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unseen}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Sidebar Menu */}
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.menuIcon}>
            <Ionicons name="menu" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sidebar Overlay */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
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
  logo: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#ccc", // fallback background color
  },
  userName: {
    color: "#FF5B00", // green
    fontSize: 16,
    fontWeight: "bold",
  },
});
