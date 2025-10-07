import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import * as Linking from "expo-linking";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Main from "./src/navigation/BottomTab";
import Header from "./src/screens/Header";
import Landing from "./src/screens/Landing";
import Profile from "./src/screens/user/Profile";
import Deals from "./src/screens/Deals";
import DealDetails from "./src/components/DealDetails";
import Notifications from "./src/screens/Notifications";
import Settings from "./src/screens/Settings";
import ActivateAccount from "./src/screens/user/ActivateAccount";

// Users Import
import Apply from "./src/screens/user/ApplyPartnership";
import EditProfile from "./src/screens/user/EditProfile";
import EditPassword from "./src/screens/user/EditPassword";
import ForgotPassword from "./src/screens/user/ForgotPassword";
import ResetPassword from "./src/screens/user/ResetPassword";
import GpsLocation from "./src/screens/user/GpsLocation";
import History from "./src/screens/user/History";
import MyDeals from "./src/screens/user/MyDeals";
import AllProducts from "./src/screens/Products";
import AllStores from "./src/screens/Stores";
import MyGears from "./src/screens/user/MyGears";
import TrackHistory from "./src/screens/user/TrackHistory";

import ProductDetails from "./src/components/ProductComponent";

// Admin Import
import EditUser from "./src/screens/admin/EditUser";
import PartnerDetails from "./src/screens/admin/PartnerDetails";
import NotifyUsers from "./src/screens/admin/NotifyUsers";

// Partner Import
import CreateDeal from "./src/screens/partner/CreateDeal";
import EditDeal from "./src/screens/partner/EditDeal";
import Employees from "./src/screens/partner/Employees";
import AddEmployee from "./src/screens/partner/AddEmployee";
import ProductServices from "./src/screens/partner/ProductServices";
import AddProduct from "./src/screens/partner/AddProduct";
import EditProduct from "./src/screens/partner/EditProduct";
import EditPartner from "./src/screens/partner/EditPartner";

// Post Imports
import HomePosts from "./src/screens/post/HomePost";
import PostDetails from "./src/screens/post/PostDetails";

// Community Imports
import Communities from "./src/screens/community/Communities";

// Dashboard
import Shop from "./src/screens/dashboard/PartnerDashboard";

import "react-native-gesture-handler";

enableScreens();

const Stack = createStackNavigator();

const linking = {
  prefixes: ["motoperx://"],
  config: {
    screens: {
      ResetPassword: "password/reset/:token",
      ActivateAccount: "confirm/:token",
    },
  },
};

const AppContent = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}
      >
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActivateAccount"
          component={ActivateAccount}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Apply" component={Apply} />
        <Stack.Screen name="Deals" component={Deals} />
        <Stack.Screen name="DealDetails" component={DealDetails} />
        <Stack.Screen name="AllProducts" component={AllProducts} />
        <Stack.Screen name="AllStores" component={AllStores} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Settings" component={Settings} />

        {/* Profile Screens */}
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="EditPassword" component={EditPassword} />
        <Stack.Screen name="GpsLocation" component={GpsLocation} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MyDeals" component={MyDeals} />
        <Stack.Screen name="MyGears" component={MyGears} />
        <Stack.Screen name="TrackHistory" component={TrackHistory} />

        <Stack.Screen name="ProductDetails" component={ProductDetails} />

        {/* Admin Screens */}
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="PartnerDetails" component={PartnerDetails} />
        <Stack.Screen name="Broadcast" component={NotifyUsers} />

        {/* Partner Screens */}
        <Stack.Screen name="CreateDeal" component={CreateDeal} />
        <Stack.Screen name="EditDeal" component={EditDeal} />
        <Stack.Screen name="Employees" component={Employees} />
        <Stack.Screen name="AddEmployee" component={AddEmployee} />
        <Stack.Screen name="Products" component={ProductServices} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name="EditPartner" component={EditPartner} />
        <Stack.Screen name="Shop" component={Shop} />

        {/* Partner Screens */}
        <Stack.Screen name="HomePosts" component={HomePosts} />
        <Stack.Screen name="PostDetails" component={PostDetails} />

        {/* Community Screens */}
        <Stack.Screen name="Communities" component={Communities} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContent;
