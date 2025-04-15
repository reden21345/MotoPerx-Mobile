import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Sidebar from "../navigation/Sidebar";

const Header = ({ navigation }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View>
      <View style={styles.header}>
        {/* Left: Logo */}
        <Image
          source={require("../../assets/logowhite.png")}
          style={styles.logo}
        />

        {/* Right: Hamburger Menu */}
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Ionicons name="menu" size={32} color="#fff" />
        </TouchableOpacity>
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
    justifyContent: "space-between", // Add this to space logo and menu
    alignItems: "center",
    backgroundColor: "#424242",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
});
