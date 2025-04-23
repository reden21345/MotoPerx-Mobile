import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeals } from "../../redux/actions/dealsAction";
import { getPartner } from "../../redux/actions/partnerAction";
import DealsComponent from "../../components/DealsComponent";
import Ionicons from "react-native-vector-icons/Ionicons";

const Deals = ({navigation}) => {
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
      <Text style={styles.screenTitle}>Created deals</Text>
      <View style={styles.buttonRow}>
      <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log("View History")}
        >
          <Text style={styles.buttonText}>
            <Ionicons name="time" size={16} color="white" /> History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateDeal')}
        >
          <Text style={styles.buttonText}>
            <Ionicons name="add-circle" size={16} color="white" /> Add
          </Text>
        </TouchableOpacity>
      </View>
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  noDealContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDealText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#424242",
  },
});

export default Deals;
