import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const GpsLocation = () => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Location</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default GpsLocation;