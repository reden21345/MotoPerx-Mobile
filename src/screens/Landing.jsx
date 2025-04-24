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
      {/* Top Section (Illustration area with a circular white background) */}
      <View style={styles.topSection}>
        <View style={styles.circleBackground}>
          <Image 
            source={require('../../assets/motor-landing.png')} 
            style={styles.illustration} 
          />
        </View>
      </View>

      {/* Bottom Section (Metal blue container with rounded top corners) */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>MOTOPERX REWARD POINTS</Text>
        <Text style={styles.subtitle}>
          REWARD AND REDEEM PRIZES USING MOTOPERX REWARD POINTS
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>LET&apos;S GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',        // white
  },
  topSection: {
    flex: 1,
    backgroundColor: '#fff',        // white
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: '#fff',        // white circle
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: width * 0.9,
    height: width * 0.9,
    resizeMode: 'contain',
  },
  bottomSection: {
    backgroundColor: '#4682B4',     // metal blue
    padding: 24,
    alignItems: 'center',
    height: height * 0.3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',                  // white text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',                  // white text
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#fff',        // white button
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4682B4',               // metal blue text
  },
});

export default Landing;
