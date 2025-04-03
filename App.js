import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import BottomTab from './src/navigation/BottomTab';
import Header from './src/screens/Header';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            // Set the custom header globally
            header: (props) => <Header {...props} />,
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{ headerShown: false }} // Hide header for Login
          />
          <Stack.Screen 
            name="Register" 
            component={Register} 
            options={{ headerShown: false }} // Hide header for Register
          />
          <Stack.Screen 
            name="Home" 
            component={BottomTab} 
            // Header will be displayed on Home and any other screens by default
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
