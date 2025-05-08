import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import useLocation from "../../hooks/useLocation";

const GpsLocation = () => {
  const {
    latitude,
    longitude,
    errorMsg,
    startTracking,
    stopTracking,
  } = useLocation();

  useEffect(() => {
    if (errorMsg) {
      Alert.alert("Location Error", errorMsg);
      stopTracking();
    }

    return () => {
      // Stop tracking when component unmounts
      stopTracking();
    };
  }, [errorMsg]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="location" size={50} color="#ccc" />
      </View>

      <Text style={styles.title}>Live Location Tracking</Text>

      <Text style={styles.desc}>
        Tap the button to start tracking your live location.
      </Text>

      <TouchableOpacity style={styles.btn} onPress={startTracking}>
        <Text style={styles.btnText}>Start Live Tracking</Text>
      </TouchableOpacity>

      {latitude && longitude && (
        <Text style={styles.desc}>
          Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  iconWrapper: {
    backgroundColor: "#f2f2f2",
    padding: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: "#1a1a1a",
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#000",
    borderRadius: 6,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GpsLocation;