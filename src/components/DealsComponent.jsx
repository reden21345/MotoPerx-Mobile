import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  RefreshControl,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { deleteDeal, getAllDeals } from "../redux/actions/dealsAction";
import { clearSuccess } from "../redux/slices/dealSlice";
import { redeemPoints } from "../redux/actions/pointsAction";
import { clearMessages } from "../redux/slices/pointSlice";

const tierColors = {
  Bronze: "#cd7f32",
  Silver: "#c0c0c0",
  Gold: "#ffd700",
  Platinum: "#e5e4e2",
};


const DealCard = ({ item, partner, onRightActions, onRedeem, navigation }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const imageList = item.images || [];

  const nextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  const expiration = new Date(item.expiryDate).toLocaleDateString();

  return (
    <Swipeable
      renderRightActions={() => (!partner ? null : onRightActions(item))}
    >
      <TouchableOpacity
        style={[
          styles.dealCard,
          {
            borderLeftColor: tierColors[item.tier] || "#98DB52", // fallback color
          },
        ]}
        onPress={() => navigation.navigate("DealDetails", { item, partner })}
      >
        <View style={styles.topSection}>
          <View style={styles.textContainer}>
            <Text style={styles.dealTitle}>{item.title}</Text>
            <Text style={styles.dealDescription}>Required Tier: {item.tier}</Text>
            <Text style={styles.dealDescription}>
              {item.partner.storeName} Shop
            </Text>
            <Text style={styles.dealDescription}>Expires: {expiration}</Text>
            <Text style={styles.dealPoints}>
              Points Required: {item.redemptionPoints}
            </Text>
          </View>
          {imageList.length > 0 && (
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={nextImage}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: imageList[imageIndex].url }}
                style={styles.dealImage}
              />
              {imageList.length > 1 && (
                <Text style={styles.imageIndex}>
                  {imageIndex + 1}/{imageList.length}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
        {!partner && (
          <TouchableOpacity style={styles.redeemButton} onPress={onRedeem}>
            <Text style={styles.buttonText}>🔥 Redeem Now</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

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

  const renderItem = (item) => (
  <DealCard
    item={item}
    partner={partner}
    onRightActions={renderRightActions}
    onRedeem={() =>
      Alert.alert("Redeem", "Do you want to redeem this deal?", [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () =>
            dispatch(redeemPoints({ dealId: item._id })).then(() =>
              dispatch(clearMessages())
            ),
        },
      ])
    }
    navigation={navigation}
  />
);

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
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  textContainer: {
    flex: 2,
    paddingRight: 10,
    color: "#000000",
  },
  imageIndex: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dealImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: "cover",
  },
  dealCard: {
    backgroundColor: "#fcfafa",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#f9fafa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: "#98DB52",
    borderRightColor: "#98DB52",
    borderRightWidth: 2,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  dealDescription: {
    fontSize: 14,
    color: "#000",
    marginVertical: 2,
  },
  dealPoints: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00d1ff",
    marginTop: 5,
  },
  redeemButton: {
    backgroundColor: "#efeffe",
    borderWidth: 1,
    borderColor: "#000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
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
