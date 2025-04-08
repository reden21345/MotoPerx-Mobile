import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  const handleProfilePress = () => {
    // Handle profile icon press, e.g., navigate to a profile screen
    console.log('Profile icon pressed');
  };

  return (
    <View style={styles.header}>
      {/* Left: MOTOPERX Logo */}
      <Image 
        source={require('../../assets/logowhite.png')} 
        style={styles.logo} 
      />

      {/* Middle: Welcome text and username */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.userName}>{user?.name || 'Juan Dela Cruz'}</Text>
      </View>

      {/* Right: Profile Icon */}
      <TouchableOpacity onPress={handleProfilePress}>
        <Ionicons name="person-circle" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',   // Dark background
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    flex: 1,                     // Take up remaining space so the icon is pushed to the right
    marginLeft: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 2,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
