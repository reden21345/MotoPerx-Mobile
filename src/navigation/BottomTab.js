import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Home from '../screens/Home';
import Deals from '../screens/Deals';
import QRScanner from '../screens/partner/QRScanner';
import Profile from '../screens/Profile';
import Badges from '../screens/user/Badges';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Deals') {
                        iconName = 'pricetag-outline';
                    } else if (route.name === 'QR Scanner') {
                        iconName = 'scan-outline';
                    } else if (route.name === 'Profile') {
                        iconName = 'person-outline';
                    } else if (route.name === 'Badges') {
                        iconName = 'medal-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Deals" component={Deals} />
            {user?.role === "partner" && (
                <Tab.Screen name="QR Scanner" component={QRScanner} />
            )}
            {user?.role === "user" && (
                <Tab.Screen name="Badges" component={Badges} />
            )}
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default BottomTab;