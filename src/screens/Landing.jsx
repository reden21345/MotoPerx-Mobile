import React from 'react';
import { 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Landing = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Top Section (Illustration area with a circular background) */}
      <View style={styles.topSection}>
        <View style={styles.circleBackground}>
          <Image 
            source={require('../../assets/motor-landing.png')} 
            style={styles.illustration} 
          />
        </View>
      </View>

      {/* Bottom Section (Black container with rounded top corners for text and button) */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>MOTOPERX REWARD POINTS</Text>
        <Text style={styles.subtitle}>
          REWARD AND REDEEM PRIZES USING MOTOPERX REWARD POINTS
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleGetStarted} // Navigate to Login when pressed
        >
          <Text style={styles.buttonText}>LET&apos;S GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Occupies the full device screen
    backgroundColor: '#fff',
  },
  topSection: {
    flex: 1, // Takes up remaining vertical space
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    width: width * 0.6,      // 60% of the device's screen width
    height: width * 0.6,     // Keeping it square
    borderRadius: (width * 0.6) / 2, // Half of width to make it circular
    backgroundColor: '#e0e0e0', // A subtle grey background; adjust as needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: width * 0.9,  // Motor image occupies 40% of screen width
    height: width * 0.9, // Maintaining a square aspect ratio
    resizeMode: 'contain',
  },
  bottomSection: {
    backgroundColor: '#000',
    padding: 24,
    alignItems: 'center',
    height: height * 0.3, // Adjust this value to make the container taller or shorter
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text on dark background
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff', // White text on dark background
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Landing;
