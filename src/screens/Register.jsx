import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/actions/authAction";

const { width } = Dimensions.get("window");
const METAL_BLUE = "#4682B4";

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const circleScale = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circleScale, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(circleScale, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleRegister = async () => {
    const data = { name, email, phone, password, avatar };
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigation.replace("Main");
    } else {
      Alert.alert("Registration Failed", result.payload || "Something went wrong");
    }
  };

  const onPressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.circle1, { transform: [{ scale: circleScale }] }]}
      />
      <Animated.View
        style={[styles.circle2, { transform: [{ rotate }] }]}
      />

      <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>CREATE YOUR{"\n"}ACCOUNT</Text>
        {error && <Text style={styles.error}>{String(error)}</Text>}

         {/* Avatar picker moved here */}
         <TouchableOpacity onPress={() => {}} style={styles.avatarPicker}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="add" size={40} color="rgba(255,255,255,0.8)" />
          )}
        </TouchableOpacity>

        {/* Form fields */}
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={24} color="#fff" />
          <TextInput
            placeholder="NAME"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="#fff" />
          <TextInput
            placeholder="EMAIL"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call" size={24} color="#fff" />
          <TextInput
            placeholder="PHONE"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color="#fff" />
          <TextInput
            placeholder="PASSWORD"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.signUpButton}
            disabled={loading}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            {loading ? (
              <ActivityIndicator color={METAL_BLUE} />
            ) : (
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: METAL_BLUE,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: -30,
    right: -30,
  },
  circle2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.1)",
    bottom: -60,
    left: -60,
  },
  body: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    justifyContent: "center",
  },
  topBar: {
    position: "absolute",
    top: 40,
    left: width * 0.05,
  },
  arrowButton: {
    padding: 8,
  },
  avatarPicker: {
    alignSelf: "center",
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 12,                   // square with slight rounding
    borderColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#fff",
  },
  error: {
    color: "#FF5252",
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    paddingVertical: 12,
    marginLeft: 8,
  },
  signUpButton: {
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  signUpButtonText: {
    color: METAL_BLUE,
    fontSize: 16,
    fontWeight: "bold",
  },
});
