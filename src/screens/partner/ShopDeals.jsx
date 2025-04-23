import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeals } from "../../redux/actions/dealsAction";
import { getPartner } from "../../redux/actions/partnerAction";
import DealsComponent from "../../components/DealsComponent";

const Deals = () => {
  const dispatch = useDispatch();
  const { deals, loading, error } = useSelector((state) => state.deals);
  const { partner } = useSelector((state) => state.partners);

  useEffect(() => {
    dispatch(getAllDeals());
    dispatch(getPartner());
  }, [dispatch]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  const filteredDeals = deals.filter(
    (deal) => deal.partner._id === partner._id
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Created Deals</Text>
      {filteredDeals.length !== 0 ? (
        <DealsComponent dealsData={filteredDeals} partner={true} />
      ) : (
        <View style={styles.noDealContainer}>
          <Text style={styles.noDealText}>No deals created yet</Text>
        </View>
      )}
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

export default Deals;
