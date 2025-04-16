import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Main from './src/navigation/BottomTab';
import Header from './src/screens/Header';
import Landing from './src/screens/Landing';
import Apply from './src/screens/user/ApplyPartnership';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();

const AppContent = () => {
  
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            header: (props) => <Header {...props} />,
          }}
        >
          <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Apply" component={Apply} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

export default AppContent;
  