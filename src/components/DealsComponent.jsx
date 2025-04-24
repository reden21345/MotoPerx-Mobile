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
import { useNavigation } from '@react-navigation/native'
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteDeal, getAllDeals } from "../redux/actions/dealsAction";
import { clearSuccess } from "../redux/slices/dealSlice";
import { redeemPoints } from "../redux/actions/pointsAction";
import { clearMessages } from "../redux/slices/pointSlice";

const DealsComponent = ({ dealsData, partner }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getAllDeals()).finally(() => setRefreshing(false));
    dispatch(clearMessages());
    dispatch(clearSuccess());
  };

  const handleEdit = (item) => {
    navigation.navigate("EditDeal", { deal: item });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this deal?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteDeal(id))
              .then(Alert.alert("Deleted", "Deal deleted successfully."))
              .catch((err) => Alert.alert("Error", err.message));
          },
        },
      ]
    );
  };

  const renderRightActions = (item) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => handleEdit(item)}
      >
        <Ionicons name="pencil" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDelete(item._id)}
      >
        <Ionicons name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = (item) => {
    const expiration = new Date(item.expiryDate).toLocaleDateString();
    return (
      <Swipeable
        renderRightActions={() => (!partner ? null : renderRightActions(item))}
      >
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
      </Swipeable>
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
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
    overflow: "hidden",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
});

export default DealsComponent;
