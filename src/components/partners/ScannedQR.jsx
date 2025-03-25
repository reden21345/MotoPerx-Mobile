import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getUserFromQr } from "../../redux/actions/qrcodeAction";
import { resetData } from "../../redux/slices/qrSlice";

const ScannedQR = ({ scannedQR, setScanned }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.qrCode);
  const [rewardPoints, setRewardPoints] = useState("");

  useEffect(() => {
    if (scannedQR) {
      console.log("Dispatching getUserFromQr with:", scannedQR);
      dispatch(getUserFromQr(scannedQR));
    }
  }, [dispatch, scannedQR]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(resetData());
      };
    }, [dispatch])
  );

  const handleRewardSubmit = () => {
    console.log("Reward Points Submitted:", rewardPoints);
    // Alert.alert()

    setRewardPoints("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Reward Points</Text>
      {data && data.user ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>User: {data.user.name}</Text>
          <Text style={styles.resultText}>Email: {data.user.email}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No user data found</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter reward points"
        keyboardType="numeric"
        value={rewardPoints}
        onChangeText={setRewardPoints}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleRewardSubmit}>
        <Text style={styles.buttonText}>Submit Points</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
        <Text style={styles.buttonText}>Scan Another QR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ScannedQR;