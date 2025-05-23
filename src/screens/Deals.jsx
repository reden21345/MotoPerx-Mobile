import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeals } from "../redux/actions/dealsAction";
import DealsComponent from "../components/DealsComponent";

const Deals = () => {
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deals);
  const { error, message } = useSelector((state) => state.points);

  useEffect(() => {
    dispatch(getAllDeals());
  }, [dispatch]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  if (message) {
    Alert.alert("Success", message);
  }

  const filteredDeals = deals.filter(
    (deal) => deal.status === 'Available'
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Available Deals</Text>
      <DealsComponent dealsData={filteredDeals} partner={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000000",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#98DB52",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Deals;
