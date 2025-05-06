import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTabBar from "./CustomTabBar";

// Screens
import HomeTab from "../screens/Home";
import Deals from "../screens/Deals";
import Profile from "../screens/user/Profile";
import GpsLocation from "../screens/user/GpsLocation";

// Admin Screens
import AllUsers from "../screens/admin/Users";
import Partners from "../screens/admin/Partners";

// Partner Screens
import PartnerDashboard from "../screens/dashboard/PartnerDashboard";
import QRScanner from "../screens/partner/QRScanner";
import ShopDeals from "../screens/partner/ShopDeals";
import Employees from "../screens/partner/Employees";

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
        {user?.role === "user" ? (
          <>
            <Tab.Screen name="Home" component={HomeTab} />
            <Tab.Screen name="Deals" component={Deals} />
            <Tab.Screen name="Location" component={GpsLocation} />
          </>
        ) : user?.role === "partner" || user?.role === "employee" ? (
          <>
            <Tab.Screen name="Shop" component={PartnerDashboard} />
            <Tab.Screen name="Scanner" component={QRScanner} />
            <Tab.Screen name="ShopDeals" component={ShopDeals} />
            {user?.role === "partner" ? (
              <Tab.Screen name="Employees" component={Employees} />
            ) : null}
          </>
        ) : (
          <>
            <Tab.Screen name="Users" component={AllUsers} />
            <Tab.Screen name="Partners" component={Partners} />
          </>
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
