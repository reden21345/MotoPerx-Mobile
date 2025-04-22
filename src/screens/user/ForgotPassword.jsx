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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword } from "../../redux/actions/authAction";

const { width } = Dimensions.get("window");

const ForgotPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const result = await dispatch(forgetPassword({ email }));
    if (forgetPassword.fulfilled.match(result)) {
      Alert.alert("Success", `Email sent to: ${email}`);
    } else {
      Alert.alert(
        "Submit Failed",
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
        <Text style={styles.title}>FORGOT PASSWORD</Text>

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

        {/* Forgot password Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;

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
  submitButton: {
    backgroundColor: "#000",
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
