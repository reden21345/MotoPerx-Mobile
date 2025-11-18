import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import Sidebar from "../navigation/Sidebar";
import Notifications from "./Notifications";

const Header = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { unseen } = useSelector((state) => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
    borderBottomColor: "#000",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    flex: 1,
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
    flex: 1,
  },
  notifContainer: {
    marginRight: 16,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
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
    width: 40,
    height: 40,
    borderRadius: 20,
    //marginBottom: 4, // space between image and text
    backgroundColor: "#ccc",
    borderColor: "#98DB52",
    borderWidth: 1,
    marginTop: 8,
  },
  userName: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
});
