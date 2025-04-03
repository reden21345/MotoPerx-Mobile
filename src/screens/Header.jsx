import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <View style={styles.header}>
      {/* Logo */}
      <Image 
        source={require('../../assets/logowhite.png')} 
        style={styles.logo} 
      />
      {/* Welcome text and user's name */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.userName}>{user?.name || 'Juan Dela Cruz'}</Text>
      </View>
      {/* VIP Badge */}
      <Text style={styles.vipText}>VIP 00001</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242', // Adjust to your preferred color
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Header;
