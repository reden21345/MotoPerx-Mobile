import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { profile } from "./src/redux/actions/authAction";
import { View, ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import "react-native-gesture-handler";

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

// Users
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

// Admin
import EditUser from "./src/screens/admin/EditUser";
import PartnerDetails from "./src/screens/admin/PartnerDetails";
import NotifyUsers from "./src/screens/admin/NotifyUsers";
import CreateAds from "./src/screens/admin/CreateAds";

// Partner
import CreateDeal from "./src/screens/partner/CreateDeal";
import EditDeal from "./src/screens/partner/EditDeal";
import Employees from "./src/screens/partner/Employees";
import AddEmployee from "./src/screens/partner/AddEmployee";
import ProductServices from "./src/screens/partner/ProductServices";
import AddProduct from "./src/screens/partner/AddProduct";
import EditProduct from "./src/screens/partner/EditProduct";
import EditPartner from "./src/screens/partner/EditPartner";

// Posts
import HomePosts from "./src/screens/post/HomePost";
import PostDetails from "./src/screens/post/PostDetails";

// Communities
import UsersCommunities from "./src/screens/community/Communities";
import CommunityDetails from "./src/screens/community/CommuniyDetails";
import CreateCommunity from "./src/screens/community/CreateCommunity";
import CommunityReports from "./src/screens/community/CommunityReports";

// Games
import GameMenu from "./src/screens/games/GameMenu";
import ReactionGame from "./src/screens/games/ReactionGame";
import QuizGame from "./src/screens/games/QuizGame";
import FuelGame from "./src/screens/games/FuelGame";

// Dashboard
import Shop from "./src/screens/dashboard/PartnerDashboard";

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
  const [initialRoute, setInitialRoute] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setInitialRoute("Landing");
          return;
        }

        const result = await dispatch(profile()).unwrap();

        if (result?.success) {
          setInitialRoute("Main");
        } else {
          await AsyncStorage.removeItem("token");
          setInitialRoute("Landing");
        }
      } catch (error) {
        console.log("Error verifying token:", error);
        await AsyncStorage.removeItem("token");
        setInitialRoute("Landing");
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  if (initialRoute === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}
      >
        {/* Auth & Landing */}
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

        {/* Main App */}
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Apply" component={Apply} />
        <Stack.Screen name="Deals" component={Deals} />
        <Stack.Screen name="DealDetails" component={DealDetails} />
        <Stack.Screen name="AllProducts" component={AllProducts} />
        <Stack.Screen name="AllStores" component={AllStores} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Settings" component={Settings} />

        {/* Profile */}
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="EditPassword" component={EditPassword} />
        <Stack.Screen name="GpsLocation" component={GpsLocation} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MyDeals" component={MyDeals} />
        <Stack.Screen name="MyGears" component={MyGears} />
        <Stack.Screen name="TrackHistory" component={TrackHistory} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />

        {/* Admin */}
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="PartnerDetails" component={PartnerDetails} />
        <Stack.Screen name="Broadcast" component={NotifyUsers} />
        <Stack.Screen name="CreateAds" component={CreateAds} />

        {/* Partner */}
        <Stack.Screen name="CreateDeal" component={CreateDeal} />
        <Stack.Screen name="EditDeal" component={EditDeal} />
        <Stack.Screen name="Employees" component={Employees} />
        <Stack.Screen name="AddEmployee" component={AddEmployee} />
        <Stack.Screen name="Products" component={ProductServices} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name="EditPartner" component={EditPartner} />
        <Stack.Screen name="Shop" component={Shop} />

        {/* Posts */}
        <Stack.Screen name="HomePosts" component={HomePosts} />
        <Stack.Screen
          name="PostDetails"
          component={PostDetails}
          options={{ headerShown: false }}
        />

        {/* Communities */}
        <Stack.Screen name="UsersCommunities" component={UsersCommunities} />
        <Stack.Screen
          name="CommunityDetails"
          component={CommunityDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CreateCommunity" component={CreateCommunity} />
        <Stack.Screen
          name="CommunityReports"
          component={CommunityReports}
          options={{ headerShown: false }}
        />

        {/* Games */}
        <Stack.Screen
          name="GameMenu"
          component={GameMenu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReactionGame"
          component={ReactionGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuizGame"
          component={QuizGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FuelGame"
          component={FuelGame}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContent;
