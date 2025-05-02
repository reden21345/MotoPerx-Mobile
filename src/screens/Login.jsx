import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/authAction';
import { clearError } from '../redux/slices/authSlice';

const { width } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(
      React.useCallback(() => {
        return () => {
          dispatch(clearError());
        };
      }, [dispatch])
    );

  const handleLogin = async () => {
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      // Navigate to 'Home' on successful login
      navigation.replace('Main');
    } else {
      Alert.alert('Login Failed', result.payload);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>LOGIN YOUR ACCOUNT</Text>

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="EMAIL"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          autoCapitalize="none"
        />
        <Ionicons
          name="mail"
          size={24}
          color="#999"
          style={styles.icon}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="PASSWORD"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Ionicons
          name="lock-closed"
          size={24}
          color="#999"
          style={styles.icon}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotContainer}
      >
        <Text style={styles.registerText}>
          &nbsp;<Text style={styles.registerLink}>Forgot password</Text>
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>LOGIN</Text>
        )}
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.registerContainer}
      >
        <Text style={styles.registerText}>
          Don't have an account?&nbsp;
          <Text style={styles.registerLink}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

//--------------------------------------
// STYLES
//--------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.08, // Responsive horizontal padding
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 12,
  },
  icon: {
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop: 25,
    alignSelf: 'center',
  },
  forgotContainer: {
    marginBottom: 25,
    alignSelf: 'left',
  },
  registerText: {
    color: '#000',
    fontSize: 14,
  },
  registerLink: {
    color: '#007bff',
  },
});
