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

// Users Import
import Apply from './src/screens/user/ApplyPartnership';
import EditProfile from './src/screens/user/EditProfile';
import EditPassword from './src/screens/user/EditPassword';
import ForgotPassword from './src/screens/user/ForgotPassword';
import ResetPassword from './src/screens/user/ResetPassword';

// Admin Import
import EditUser from './src/screens/admin/EditUser';

// Partner Import
import CreateDeal from './src/screens/partner/CreateDeal';
import EditDeal from './src/screens/partner/EditDeal';

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

          {/* Profile Screens */}
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="EditPassword" component={EditPassword} />

          {/* Admin Screens */}
          <Stack.Screen name="EditUser" component={EditUser} />

          {/* Admin Screens */}
          <Stack.Screen name="CreateDeal" component={CreateDeal} />
          <Stack.Screen name="EditDeal" component={EditDeal} />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }

export default AppContent;
  