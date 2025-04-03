import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

// Screens
import Home from '../screens/Home';
import Deals from '../screens/Deals';
import QRScanner from '../screens/partner/QRScanner';
import Profile from '../screens/Profile';
import Badges from '../screens/user/Badges';

// For showing QR in the modal
import QRCode from 'react-native-qrcode-svg';

const Tab = createBottomTabNavigator();

/**
 * CustomTabBar
 *  - Renders a pill-shaped black tab bar with rounded corners.
 *  - Places a blue center button for "Show QR".
 *  - When pressed, it displays a modal with the user’s QR code.
 */
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { qrCode } = useSelector((reduxState) => reduxState.qrCode);
  const [modalVisible, setModalVisible] = useState(false);

  const handleShowQR = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Filter out the dummy route for the center button.
  const visibleRoutes = state.routes.filter((r) => r.name !== 'ShowQRButton');

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
        {visibleRoutes.slice(0, Math.ceil(visibleRoutes.length / 2)).map((route, index) =>
          renderTabItem(route, index, state, descriptors, navigation)
        )}

        {/* Center Button */}
        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity style={styles.centerButton} onPress={handleShowQR}>
            <Ionicons name="qr-code-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Right side routes */}
        {visibleRoutes.slice(Math.ceil(visibleRoutes.length / 2)).map((route, index) => {
          const actualIndex = index + Math.ceil(visibleRoutes.length / 2);
          return renderTabItem(route, actualIndex, state, descriptors, navigation);
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

  const isFocused = state.index === state.routes.findIndex((r) => r.name === route.name);

  let iconName;
  if (route.name === 'Home') {
    iconName = isFocused ? 'home' : 'home-outline';
  } else if (route.name === 'Deals') {
    iconName = isFocused ? 'pricetag' : 'pricetag-outline';
  } else if (route.name === 'QR Scanner') {
    iconName = isFocused ? 'scan' : 'scan-outline';
  } else if (route.name === 'Badges') {
    iconName = isFocused ? 'medal' : 'medal-outline';
  } else if (route.name === 'Profile') {
    iconName = isFocused ? 'person' : 'person-outline';
  }

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
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
      <Ionicons name={iconName} size={24} color={isFocused ? '#fff' : '#999'} />
      <Text style={[styles.tabItemText, { color: isFocused ? '#fff' : '#999' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const BottomTab = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    // Wrap in SafeAreaView so content from individual screens is automatically adjusted.
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Deals" component={Deals} />
        {user?.role === 'partner' && (
          <Tab.Screen name="QR Scanner" component={QRScanner} />
        )}
        {user?.role === 'user' && (
          <Tab.Screen name="Badges" component={Badges} />
        )}
        <Tab.Screen name="Profile" component={Profile} />
        {/*
          Dummy route so that the center "Show QR" button is in the middle.
          This route is hidden in CustomTabBar.
        */}
        <Tab.Screen
          name="ShowQRButton"
          component={() => null}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default BottomTab;

/** STYLES */
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Tab bar is now part of the layout (no absolute positioning)
  tabBarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 60,
    backgroundColor: '#000',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemText: {
    fontSize: 10,
    marginTop: 2,
  },
  // Center button styles
  centerButtonWrapper: {
    width: 60,
    alignItems: 'center',
  },
  centerButton: {
    marginTop: -15, // Slight negative margin for a small floating effect
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
