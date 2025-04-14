import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTabBar from "./CustomTabBar";

// Screens
import HomeTab from "../screens/Home";
import Deals from "../screens/Deals";
import QRScanner from "../screens/partner/QRScanner";
import PartnerDashboard from "../screens/dashboard/PartnerDashboard";
import Profile from "../screens/Profile";
import Badges from "../screens/user/Badges";

const Tab = createBottomTabNavigator();

const DummyScreen = () => null;
const BottomTab = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeTab} />
        <Tab.Screen name="Deals" component={Deals} />
        {user?.role === "user" ? (
          <Tab.Screen name="Badges" component={Badges} />
        ) : user?.role === "partner" || user?.role === "employee" ? (
          <>
            <Tab.Screen name="Scanner" component={QRScanner} />
            <Tab.Screen name="Shop" component={PartnerDashboard} />
          </>
        ) : (
          <Tab.Screen name="Admin" component={DummyScreen} />
        )}
        <Tab.Screen name="Profile" component={Profile} />

        <Tab.Screen
          name="ShowQRButton"
          component={DummyScreen}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default BottomTab;