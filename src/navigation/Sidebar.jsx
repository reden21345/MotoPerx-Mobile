import React, { useEffect, useRef } from "react";
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
const SIDEBAR_WIDTH = Math.round(width * 0.75);

const Sidebar = ({ isOpen, onClose, navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const translateX = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

  const items = [
    { name: "Dashboard", icon: "grid-outline", screen: "Shop" },
    { name: "Settings", icon: "settings-outline", screen: "Profile" },
    { name: "Transaction", icon: "card-outline", screen: "Deals" },
    { name: "Apply Partnership", icon: "business-outline", screen: "Apply" },
    { name: "Logout", icon: "log-out-outline", screen: "Login" },
  ];

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <View style={styles.overlayContainer} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Backdrop: only left side */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.sidebar,
          { width: SIDEBAR_WIDTH, transform: [{ translateX }], right: 0 },
        ]}
      >
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {user?.avatar?.url ? (
            <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={60} color="#fff" />
          )}
          <Text style={styles.name}>{user?.name || "User Name"}</Text>
        </View>

        {/* Navigation Items */}
        <View style={styles.links}>
          {items.map((item) => (
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
    width,
    height,
    zIndex: 999,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width - SIDEBAR_WIDTH,
    height,
    backgroundColor: "transparent",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "#2b2b2b",
    paddingTop: 40,
    paddingHorizontal: 16,
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
