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
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { addEmployee } from "../../redux/actions/partnerAction";
import { pickAvatar } from "../../utils/helpers";

const { width } = Dimensions.get("window");

const AddEmployee = ({ navigation }) => {
  const dispatch = useDispatch();

  const { error, loading } = useSelector((state) => state.partners);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleAddEmployee = async () => {
    const data = { name, email, phone, password, avatar };
    const result = await dispatch(addEmployee(data));
    if (addEmployee.fulfilled.match(result)) {
      Alert.alert("Employee Added", `Employee ${name} added!`);
      navigation.replace("Main");
    } else {
      Alert.alert(
        "Adding Employee Failed",
        result.payload || "Something went wrong"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>ADD EMPLOYEE</Text>

        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setNewUser(!newUser)}
          >
            <View style={styles.radioCircle}>
              {newUser && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.radioLabel}>New User</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{String(error)}</Text>}

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
          <Ionicons name="mail" size={24} color="#999" style={styles.icon} />
        </View>

        {newUser && (
          <>
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

            {/* Phone Input */}
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

            {/* Password Input */}
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

            {/* Avatar Picker */}
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
          </>
        )}

        {/* Add Button */}
        <TouchableOpacity
          onPress={handleAddEmployee}
          style={styles.addEmpButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addEmpButtonText}>ADD</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddEmployee;

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
  addEmpButton: {
    backgroundColor: "#000",
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 15,
  },
  addEmpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  radioLabel: {
    fontSize: 15,
  },
});
