import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useDispatch } from "react-redux";
import { getAllDeals } from "../redux/actions/dealsAction";
import { redeemPoints } from "../redux/actions/pointsAction";
import { clearMessages } from "../redux/slices/pointSlice";

const DealsComponent = ({ dealsData, partner }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getAllDeals()).finally(() => setRefreshing(false));
    dispatch(clearMessages());
  };

  const renderItem = (item) => {
    const expiration = new Date(item.expiryDate).toLocaleDateString();
    return (
      <View style={styles.dealCard}>
        <Text style={styles.dealTitle}>{item.title}</Text>
        <Text style={styles.dealDescription}>{item.description}</Text>
        <Text style={styles.dealDescription}>
          {item.partner.storeName} Shop
        </Text>
        <Text style={styles.dealDescription}>{expiration}</Text>
        <Text style={styles.dealPoints}>
          Points Required: {item.redemptionPoints}
        </Text>
        {!partner && (
          <TouchableOpacity
            style={styles.redeemButton}
            onPress={() =>
              Alert.alert("Redeem", `Do you want to redeem this deal?`, [
                { text: "No", style: "cancel" },
                {
                  text: "Yes",
                  onPress: () =>
                    dispatch(redeemPoints({ dealId: item._id })).then(() => {
                      dispatch(clearMessages());
                    }),
                },
              ])
            }
          >
            <Text style={styles.buttonText}>Redeem</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={dealsData}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => renderItem(item)}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  dealCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dealDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  dealPoints: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  redeemButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DealsComponent;
