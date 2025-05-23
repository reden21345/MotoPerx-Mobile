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
import NotifyUsers from "../screens/admin/NotifyUsers";

// Partner Screens
import PartnerDashboard from "../screens/dashboard/PartnerDashboard";
import QRScanner from "../screens/partner/QRScanner";
import ShopDeals from "../screens/partner/ShopDeals";
import Employees from "../screens/partner/Employees";
import Products from "../screens/partner/ProductServices";

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
        {user?.role === "user" || user?.role === "pendingPartner" ? (
          <>
            <Tab.Screen name="Home" component={HomeTab} />
            <Tab.Screen name="Deals" component={Deals} />
            <Tab.Screen name="Location" component={GpsLocation} />
          </>
        ) : user?.role === "partner" || user?.role === "employee" ? (
          <>
            <Tab.Screen name="Shop" component={PartnerDashboard} />
            {user?.role === "partner" ? (
              <Tab.Screen name="Employees" component={Employees} />
            ) : <Tab.Screen name="Scanner" component={QRScanner} />}
            <Tab.Screen name="ShopDeals" component={ShopDeals} />
            <Tab.Screen name="Products" component={Products} />
          </>
        ) : (
          <>
            <Tab.Screen name="Users" component={AllUsers} />
            <Tab.Screen name="Partners" component={Partners} />
            <Tab.Screen name="Broadcast" component={NotifyUsers} />
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
