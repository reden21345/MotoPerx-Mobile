import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { confirmAccount } from "../../redux/actions/authAction";

const ActivateAccount = () => {
  const { params } = useRoute();
  const { token } = params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  console.log(token)
  const handleActivate = async () => {

    try {
      const resultAction = await dispatch(confirmAccount(token));

      if (confirmAccount.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Email is activated");
        navigation.replace("Main");
      } else if (confirmAccount.rejected.match(resultAction)) {
        Alert.alert("Error", resultAction.payload || "Activation failed");
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.errMessage || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MOTOPERX</Text>
      <Text style={styles.title}>Activate Account</Text>

      <TouchableOpacity style={styles.button} onPress={handleActivate}>
        <Text style={styles.buttonText}>Activate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ActivateAccount;
