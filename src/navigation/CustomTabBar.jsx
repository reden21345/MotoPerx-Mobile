import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import QRCode from "react-native-qrcode-svg";

/**
 * CustomTabBar
 *  - Renders a pill-shaped black tab bar with rounded corners.
 *  - Places a blue center button for "Show QR".
 *  - When pressed, it displays a modal with the user’s QR code.
 */
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { qrCode } = useSelector((reduxState) => reduxState.qrCode);
  const [modalVisible, setModalVisible] = useState(false);

  const handleShowQR = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Filter out the dummy route for the center button.
  const visibleRoutes = state.routes.filter((r) => r.name !== "ShowQRButton");

  return (
    <>
      {/* Modal for displaying the QR code */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {qrCode?.code ? (
              <>
                <QRCode value={qrCode.code.toString()} size={150} />
                <Text style={styles.qrLabel}>Scan Me!</Text>
              </>
            ) : (
              <Text style={styles.qrLabel}>QR Code Loading...</Text>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* The pill-shaped tab bar becomes part of the layout */}
      <View style={styles.tabBarContainer}>
        {/* Left side routes */}
        {visibleRoutes
          .slice(0, Math.ceil(visibleRoutes.length / 2))
          .map((route, index) =>
            renderTabItem(route, index, state, descriptors, navigation)
          )}

        {/* Center Button */}
        {(user?.role === "user" || user?.role === "pendingPartner") && (
          <View style={styles.centerButtonWrapper}>
            <TouchableOpacity
              style={styles.centerButton}
              onPress={handleShowQR}
            >
              <Ionicons name="qr-code-outline" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Right side routes */}
        {visibleRoutes
          .slice(Math.ceil(visibleRoutes.length / 2))
          .map((route, index) => {
            const actualIndex = index + Math.ceil(visibleRoutes.length / 2);
            return renderTabItem(
              route,
              actualIndex,
              state,
              descriptors,
              navigation
            );
          })}
      </View>
    </>
  );
};
/**
 * Helper function to render a single tab item (icon + label).
 */
const renderTabItem = (route, index, state, descriptors, navigation) => {
  const { options } = descriptors[route.key];
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const isFocused =
    state.index === state.routes.findIndex((r) => r.name === route.name);

  let iconName;
  if (route.name === "Home") {
    iconName = isFocused ? "home" : "home-outline";
  } else if (route.name === "Deals" || route.name === "ShopDeals") {
    iconName = isFocused ? "pricetag" : "pricetag-outline";
  } else if (route.name === "Scanner") {
    iconName = isFocused ? "scan" : "scan-outline";
  } else if (route.name === "Badges") {
    iconName = isFocused ? "medal" : "medal-outline";
  } else if (route.name === "Profile") {
    iconName = isFocused ? "person" : "person-outline";
  } else if (route.name === "Shop") {
    iconName = isFocused ? "storefront" : "storefront-outline";
  } else if (route.name === "Users" || route.name === "Employees") {
    iconName = isFocused ? "people" : "people-outline";
  } else if (route.name === "Partners") {
    iconName = isFocused ? "business" : "business-outline";
  } else if (route.name === "Location") {
    iconName = isFocused ? "location" : "location-outline";
  } else if (route.name === "Products") {
    iconName = isFocused ? "construct" : "construct-outline";
  } else if (route.name === "Broadcast") {
    iconName = isFocused ? "megaphone" : "megaphone-outline";
  }

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <TouchableOpacity
      key={route.name}
      onPress={onPress}
      style={styles.tabItem}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={iconName} size={24} color={isFocused ? "#fff" : "#999"} />
      <Text
        style={[styles.tabItemText, { color: isFocused ? "#fff" : "#999" }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  tabBarContainer: {
    marginHorizontal: 0,
    height: 60,
    backgroundColor: "#000000", // black
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemText: {
    fontSize: 10,
    marginTop: 2,
    color: "#FFFFFF", // white text
  },
  centerButtonWrapper: {
    width: 60,
    alignItems: "center",
  },
  centerButton: {
    marginTop: -15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#84DD31", // green
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 260,
    backgroundColor: "#FFFFFF", // white
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#000000", // black
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#84DD31", // green
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#000000", // black text for contrast
    fontWeight: "600",
  },
});


export default CustomTabBar;