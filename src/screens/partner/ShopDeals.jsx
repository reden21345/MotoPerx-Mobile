import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllDeals } from "../../redux/actions/dealsAction";
import DealsComponent from "../../components/DealsComponent";
import Ionicons from "react-native-vector-icons/Ionicons";

const Deals = ({ navigation }) => {
  const dispatch = useDispatch();
  const { deals, loading, error } = useSelector((state) => state.deals);
  const { partner } = useSelector((state) => state.partners);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getAllDeals());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getAllDeals()).finally(() => setRefreshing(false));
  };

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
          onPress={() => navigation.navigate("CreateDeal")}
        >
          <Text style={styles.buttonText}>
            <Ionicons name="add-circle" size={16} color="white" /> Add
          </Text>
        </TouchableOpacity>
      </View>
      {filteredDeals.length !== 0 ? (
        <DealsComponent dealsData={filteredDeals} partner={true} />
      ) : (
        <ScrollView
          style={styles.noDealContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.noDealText}>No deals created yet</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
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
    shadowColor: "#98DB52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#98DB52",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  noDealContainer: {
    flex: 1,
    padding: 20,
  },
  noDealText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#424242",
  },
});

export default Deals;
