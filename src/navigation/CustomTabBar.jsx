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

const METAL_BLUE = "#4682B4";
const INACTIVE_WHITE = "rgba(255,255,255,0.6)";
const WHITE = "#FFFFFF";
const { width } = Dimensions.get("window");

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { qrCode } = useSelector((reduxState) => reduxState.qrCode);
  const [modalVisible, setModalVisible] = useState(false);

  const visibleRoutes = state.routes.filter((r) => r.name !== "ShowQRButton");

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
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
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.tabBarContainer}>
        {visibleRoutes
          .slice(0, Math.ceil(visibleRoutes.length / 2))
          .map((route, index) =>
            renderTabItem(route, index, state, descriptors, navigation)
          )}

        {user?.role === "user" && (
          <View style={styles.centerButtonWrapper}>
            <TouchableOpacity
              style={styles.centerButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="qr-code-outline" size={30} color={METAL_BLUE} />
            </TouchableOpacity>
          </View>
        )}

        {visibleRoutes
          .slice(Math.ceil(visibleRoutes.length / 2))
          .map((route, idx) =>
            renderTabItem(
              route,
              idx + Math.ceil(visibleRoutes.length / 2),
              state,
              descriptors,
              navigation
            )
          )}
      </View>
    </>
  );
};

const renderTabItem = (route, index, state, descriptors, navigation) => {
  const { options } = descriptors[route.key];
  const label = options.tabBarLabel ?? options.title ?? route.name;
  const isFocused =
    state.index === state.routes.findIndex((r) => r.name === route.name);

  let iconName;
  switch (route.name) {
    case "Home":
      iconName = isFocused ? "home" : "home-outline";
      break;
    case "Deals":
      iconName = isFocused ? "pricetag" : "pricetag-outline";
      break;
    case "Scanner":
      iconName = isFocused ? "scan" : "scan-outline";
      break;
    case "Badges":
      iconName = isFocused ? "medal" : "medal-outline";
      break;
    case "Profile":
      iconName = isFocused ? "person" : "person-outline";
      break;
    case "Shop":
      iconName = isFocused ? "storefront" : "storefront-outline";
      break;
    case "Users":
      iconName = isFocused ? "people" : "people-outline";
      break;
    default:
      iconName = isFocused ? "ellipse" : "ellipse-outline";
  }

  return (
    <TouchableOpacity
      key={route.name}
      onPress={() => navigation.navigate(route.name)}
      style={styles.tabItem}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={isFocused ? WHITE : INACTIVE_WHITE}
      />
      <Text style={[styles.tabItemText, { color: isFocused ? WHITE : INACTIVE_WHITE }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 60,
    backgroundColor: METAL_BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 260,
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: METAL_BLUE,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  closeButtonText: {
    color: WHITE,
    fontWeight: "600",
  },
});

export default CustomTabBar;
