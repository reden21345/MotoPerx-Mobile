import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/authAction';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form fade & button press
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Decorative circle animations
  const circle1Scale = useRef(new Animated.Value(1)).current;
  const circle2Rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the form
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    // Pulse circle1
    Animated.loop(
      Animated.sequence([
        Animated.timing(circle1Scale, { toValue: 1.1, duration: 3000, useNativeDriver: true }),
        Animated.timing(circle1Scale, { toValue: 1,   duration: 3000, useNativeDriver: true }),
      ])
    ).start();

    // Rotate circle2 continuously
    Animated.loop(
      Animated.timing(circle2Rotate, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLogin = async () => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigation.replace('Main');
    } else {
      Alert.alert('Login Failed', result.payload);
    }
  };

  const onPressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true }).start();

  const rotateInterp = circle2Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle1, { transform: [{ scale: circle1Scale }] }]} />
      <Animated.View style={[styles.circle2, { transform: [{ rotate: rotateInterp }] }]} />

      <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>WELCOME BACK</Text>
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#fff" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#fff" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#4682B4" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Text style={styles.registerText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4682B4',     // metal blue
    paddingHorizontal: width * 0.08,
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: -40,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -80,
    left: -80,
  },
  // formContainer: {
  //   backgroundColor: 'rgba(255,255,255,0.1)',
  //   padding: 24,
  //   borderRadius: 20,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.2,
  //   shadowRadius: 10,
  //   elevation: 5,
  // },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  error: {
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#fff',
  },
  forgot: {
    alignSelf: 'flex-end',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#4682B4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
  },
  registerLink: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
