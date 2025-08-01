import React, { useState, useEffect } from "react";
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
  Modal,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, validateReferral } from "../redux/actions/authAction";
import { useFocusEffect } from "@react-navigation/native";
import { clearAuthMessage } from "../redux/slices/authSlice";
import MapView, { Marker } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  pickAvatar,
  formatDate,
  fetchCurrentLocation,
  handleMapSearch,
} from "../utils/helpers";

const { width } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [location, setLocation] = useState(null);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState(null);
  const [region, setRegion] = useState(null);

  const [birthday, setBirthday] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [mapVisible, setMapVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCurrentLocation(setRegion);
  }, []);

  if (message) {
    Alert.alert("Success", message);
  }

  const handleRegionChangeComplete = (newRegion) => {
    setRegion((prev) => ({
      ...prev,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      latitudeDelta: newRegion.latitudeDelta,
      longitudeDelta: newRegion.longitudeDelta,
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      return Alert.alert("Validation Error", "Please fill up required fields.");
    }

    if (!isValidEmail(email)) {
      return Alert.alert("Validation Error", "Please enter a valid email.");
    }

    const data = {
      name,
      email,
      phone,
      password,
      avatar,
      code,
      location,
      birthday,
    };
    dispatch(registerUser(data)).then(() => {
      navigation.goBack();
    });
  };

  const handleReferral = async () => {
    const data = { refCode: code };
    const result = await dispatch(validateReferral(data));
    if (validateReferral.fulfilled.match(result)) {
      Alert.alert("Valid!", "Referral code is valid");
      setStep(3);
    } else {
      Alert.alert(
        "Registration Failed",
        result.payload || "Something went wrong"
      );
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
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

      <ScrollView contentContainerStyle={styles.body}>
        {step === 3 && (
          <Text style={styles.title}>CREATE YOUR{"\n"}ACCOUNT</Text>
        )}

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
              onPress={() => handleReferral()}
              style={styles.signUpButton}
            >
              {!loading ? (
                <Text style={styles.signUpButtonText}>Next</Text>
              ) : (
                <ActivityIndicator color="#fff" />
              )}
            </TouchableOpacity>
          </>
        )}
        {step === 3 && (
          <>
            <TouchableOpacity
              onPress={() => pickAvatar(setAvatar)}
              style={styles.avatarPicker}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>Add Avatar</Text>
              )}
            </TouchableOpacity>

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

            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text style={styles.datePickerText}>
                  {birthday
                    ? `Birthday: ${formatDate(birthday)}`
                    : "Select your birthday"}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="balloon"
                size={24}
                color="#999"
                style={styles.icon}
              />
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={birthday || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
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

            <TouchableOpacity
              style={styles.locBtn}
              onPress={() => setMapVisible(true)}
            >
              <Text style={styles.buttonText}>Location</Text>
              <Ionicons
                name="map"
                size={20}
                color="white"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>

            <Modal visible={mapVisible} animationType="slide">
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.input2}
                  placeholder="Search Location"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                  onPress={() =>
                    handleMapSearch(searchQuery, setLocation, setRegion)
                  }
                  style={styles.searchButton}
                >
                  <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
              </View>
              {region ? (
                <MapView
                  style={styles.map}
                  initialRegion={region}
                  onRegionChangeComplete={handleRegionChangeComplete}
                >
                  <Marker coordinate={region} />
                </MapView>
              ) : (
                <ActivityIndicator size="large" color="#424242" />
              )}

              <TouchableOpacity
                onPress={() => {
                  if (region) {
                    setLocation([region.longitude, region.latitude]);
                  }
                  setMapVisible(false);
                }}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </Modal>

            {location && (
              <MapView style={styles.miniMap} region={region}>
                <Marker coordinate={region} />
              </MapView>
            )}

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
      </ScrollView>
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
    backgroundColor: "#98DB52",
    borderRadius: 5,
  },
  body: {
    paddingHorizontal: width * 0.08,
    paddingBottom: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#98DB52",
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
    borderColor: "#98DB52",
    borderWidth: 1,
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
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  locBtn: {
    backgroundColor: "#424242",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    position: "absolute", // Position it over the map
    bottom: 30, // Distance from the bottom of the screen
    alignSelf: "center", // Center horizontally
    backgroundColor: "#424242",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    zIndex: 10, // Ensure it’s above the map
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  map: {
    width: "100%",
    height: "90%",
  },
  searchContainer: { flexDirection: "row", padding: 10 },
  input2: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#424242",
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  miniMap: {
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
  datePickerText: {
    color: "#000",
  },
});
