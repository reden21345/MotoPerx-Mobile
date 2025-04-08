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
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/actions/authAction';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigation.replace('Home');
    } else {
      Alert.alert('Registration Failed', result.payload || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Back Arrow */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Body */}
      <View style={styles.body}>
        <Text style={styles.title}>CREATE YOUR{'\n'}ACCOUNT</Text>

        {error && (
          <Text style={styles.error}>{String(error)}</Text>
        )}

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="NAME"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Ionicons
            name="person"
            size={24}
            color="#999"
            style={styles.icon}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="EMAIL"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
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

        {/* Register (Sign Up) Button */}
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.signUpButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpButtonText}>SIGN UP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

//---------------------------------------------------
// STYLES
//---------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Top bar with back arrow
  topBar: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: width * 0.05,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  arrowButton: {
    padding: 5,
  },
  // Main body
  body: {
    flex: 1,
    paddingHorizontal: width * 0.08, // Responsive horizontal padding
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    color: '#000',
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  // Input containers with icons
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
  // Sign Up button
  signUpButton: {
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
