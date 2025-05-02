import React, { useState } from "react";
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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/actions/authAction";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const { width } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState(null);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64Image = `data:image/jpeg;base64,${base64}`;
      setAvatar(base64Image);
    }
  };

  const handleRegister = async () => {
    const data = { name, email, phone, password, avatar, code };
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      navigation.replace("Main");
    } else {
      Alert.alert(
        "Registration Failed",
        result.payload || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {step === 3 &&(<Text style={styles.title}>CREATE YOUR{"\n"}ACCOUNT</Text>)}

        {error && <Text style={styles.error}>{String(error)}</Text>}

        {step === 1 && (
          <>
            <Text style={styles.title}>Do you have a referral code?</Text>
            <TouchableOpacity
              onPress={() => setStep(2)}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpButtonText}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStep(3)}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpButtonText}>NO</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.title}>Enter Referral Code</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Referral Code"
                placeholderTextColor="#888"
                value={code}
                onChangeText={setCode}
                style={styles.input}
              />
              <Ionicons
                name="code-outline"
                size={24}
                color="#999"
                style={styles.icon}
              />
            </View>

            <TouchableOpacity
              onPress={() => setStep(3)}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        {step === 3 && (
          <>
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

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="PHONE"
                placeholderTextColor="#888"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <Ionicons
                name="call"
                size={24}
                color="#999"
                style={styles.icon}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="PASSWORD"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.icon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={pickAvatar} style={styles.avatarPicker}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>Add Avatar</Text>
              )}
            </TouchableOpacity>

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
          </>
        )}
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: width * 0.05,
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  arrowButton: {
    padding: 5,
  },
  body: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#000",
  },
  error: {
    color: "red",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 12,
  },
  icon: {
    paddingLeft: 10,
  },
  avatarPicker: {
    alignSelf: "center",
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: "#888",
    textAlign: "center",
  },
  signUpButton: {
    backgroundColor: "#000",
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 15,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
