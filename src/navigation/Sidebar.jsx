import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logoutAndReset } from "../redux/actions/logoutAndReset";

const { width, height } = Dimensions.get("window");

const Sidebar = ({ isOpen, onClose, navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const translateY = React.useRef(new Animated.Value(-height)).current;

  const partners = [
    { name: "Dashboard", icon: "grid-outline", screen: "Main" },
    { name: "Settings", icon: "settings-outline", screen: "Settings" },
    { name: "Transaction", icon: "card-outline", screen: "History" },
    { name: "Logout", icon: "log-out-outline", screen: "Login" },
  ];

  const riders = [
    { name: "Home", icon: "grid-outline", screen: "Main" },
    { name: "Settings", icon: "settings-outline", screen: "Settings" },
    { name: "Transaction", icon: "card-outline", screen: "History" },
    { name: "Apply Partnership", icon: "business-outline", screen: "Apply" },
    { name: "Logout", icon: "log-out-outline", screen: "Login" },
  ];

  const admins = [
    { name: "Dashboard", icon: "grid-outline", screen: "Main" },
    { name: "Settings", icon: "settings-outline", screen: "Settings" },
    { name: "Logout", icon: "log-out-outline", screen: "Login" },
  ];

  const items =
    user?.role === "partner" || user?.role === "employee"
      ? partners
      : user?.role === "user" || user?.role === "pendingPartner"
      ? riders
      : admins;

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOpen ? 0 : -height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <View style={styles.overlayContainer}>
      {/* Background overlay */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => navigation.navigate("Profile")}
        >
          {user?.avatar?.url ? (
            <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={60} color="#fff" />
          )}
          <Text style={styles.name}>{user?.name || "Anonymous"}</Text>
        </TouchableOpacity>

        {/* Navigation Links */}
        <View style={styles.links}>
          {items?.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.link}
              onPress={() => {
                if (item.name === "Logout") {
                  dispatch(logoutAndReset()).then(() => {
                    navigation.navigate(item.screen);
                    onClose();
                  });
                } else {
                  navigation.navigate(item.screen);
                  onClose();
                }
              }}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color="#fff"
                style={{ marginRight: 12 }}
              />
              <Text style={styles.linkText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: height,
    width: width,
    zIndex: 999,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    backgroundColor: "#2b2b2b",
    paddingTop: 40,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  links: {
    marginTop: 10,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#444",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
  },
});
