import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import * as Linking from 'expo-linking';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Main from './src/navigation/BottomTab';
import Header from './src/screens/Header';
import Landing from './src/screens/Landing';
import Profile from './src/screens/user/Profile';
import Deals from './src/screens/Deals';

// Users Import
import Apply from './src/screens/user/ApplyPartnership';
import EditProfile from './src/screens/user/EditProfile';
import EditPassword from './src/screens/user/EditPassword';
import ForgotPassword from './src/screens/user/ForgotPassword';
import ResetPassword from './src/screens/user/ResetPassword';
import GpsLocation from './src/screens/user/GpsLocation';
import History from './src/screens/user/History';
import MyDeals from './src/screens/user/MyDeals';
import AllProducts from './src/screens/Products';
import AllStores from './src/screens/Stores';

// Admin Import
import EditUser from './src/screens/admin/EditUser';
import PartnerDetails from './src/screens/admin/PartnerDetails';

// Partner Import
import CreateDeal from './src/screens/partner/CreateDeal';
import EditDeal from './src/screens/partner/EditDeal';
import Employees from './src/screens/partner/Employees';
import AddEmployee from './src/screens/partner/AddEmployee';
import ProductServices from './src/screens/partner/ProductServices';
import AddProduct from './src/screens/partner/AddProduct';
import EditProduct from './src/screens/partner/EditProduct';

// Dashboard
import Shop from './src/screens/dashboard/PartnerDashboard';

import 'react-native-gesture-handler';

enableScreens();

const Stack = createStackNavigator();

const linking = {
  prefixes: ['motoperx://'],
  config: {
    screens: {
      ResetPassword: 'password/reset/:token',
      Login: 'Login',
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
          <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Apply" component={Apply} />
          <Stack.Screen name="Deals" component={Deals} />
          <Stack.Screen name="AllProducts" component={AllProducts} />
          <Stack.Screen name="AllStores" component={AllStores} />

          {/* Profile Screens */}
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="EditPassword" component={EditPassword} />
          <Stack.Screen name="GpsLocation" component={GpsLocation} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="MyDeals" component={MyDeals} />

          {/* Admin Screens */}
          <Stack.Screen name="EditUser" component={EditUser} />
          <Stack.Screen name="PartnerDetails" component={PartnerDetails} />

          {/* Partner Screens */}
          <Stack.Screen name="CreateDeal" component={CreateDeal} />
          <Stack.Screen name="EditDeal" component={EditDeal} />
          <Stack.Screen name="Employees" component={Employees} />
          <Stack.Screen name="AddEmployee" component={AddEmployee} />
          <Stack.Screen name="Products" component={ProductServices} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
          <Stack.Screen name="EditProduct" component={EditProduct} />

          {/* Partner Screens */}
          <Stack.Screen name="Shop" component={Shop} />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }

export default AppContent;
  