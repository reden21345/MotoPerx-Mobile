import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions } from "react-native";
import useLocation from "../../hooks/useLocation";
import MapView, { Marker } from "react-native-maps";

const GpsLocation = () => {
  const {
    latitude,
    longitude,
    errorMsg,
    startTracking,
    stopTracking,
  } = useLocation();

  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    startTracking();

    return () => {
      stopTracking();
    };
  }, []);

  useEffect(() => {
    if (errorMsg) {
      Alert.alert("Location Error", errorMsg);
      stopTracking();
      setIsTracking(false);
    }
  }, [errorMsg]);

  const handleStopTracking = () => {
    stopTracking();
    setIsTracking(false);
  };

  const handleStartTracking = () => {
    startTracking();
    setIsTracking(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location Tracking</Text>

      {isTracking && latitude && longitude ? (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation
            followsUserLocation
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>

          <Text style={styles.coords}>
            Latitude: {latitude.toFixed(6)} | Longitude: {longitude.toFixed(6)}
          </Text>

          <TouchableOpacity style={styles.stopBtn} onPress={handleStopTracking}>
            <Text style={styles.stopBtnText}>Stop Tracking</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.startBtn} onPress={handleStartTracking}>
          <Text style={styles.startBtnText}>Start Tracking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    color: "#1a1a1a",
    marginBottom: 10,
  },
  map: {
    width: width - 40,
    height: height / 2,
    borderRadius: 10,
  },
  coords: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  stopBtn: {
    backgroundColor: "#ff3333",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  stopBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  startBtn: {
    backgroundColor: "#000",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  startBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default GpsLocation;
