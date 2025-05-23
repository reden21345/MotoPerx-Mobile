import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getRedeemedDeals } from "../../redux/actions/dealsAction";

const MyDeals = () => {
  const dispatch = useDispatch();
  const { redeemed, loading, error } = useSelector((state) => state.deals);
  const { user } = useSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getRedeemedDeals()).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (user) {
      dispatch(getRedeemedDeals());
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const handleUseDeal = (deal) => {
      Alert.alert(
        "Use deal",
        `Use the ${deal.title}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "", style: "cancel" },
          {
            text: "Use",
            style: "destructive",
            onPress: async () => {
              console.log("Deal is used")
            },
          },
        ]
      );
    };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.screenTitle}>Redeemed Deals</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : redeemed.length === 0 ? (
        <Text style={styles.noDealsText}>No redeemed deals found.</Text>
      ) : (
        redeemed.map((deal) => {
          const imageUrl = deal.images?.[0]?.url || null;
          const expiry = new Date(deal.expiryDate).toLocaleDateString();

          return (
            <TouchableOpacity
              key={deal._id}
              style={styles.dealCard}
              onPress={() => handleUseDeal(deal)}
              disabled={deal.used}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.dealImage}
                resizeMode="cover"
              />
              <View style={styles.dealContent}>
                <Text style={styles.dealTitle}>{deal.title}</Text>
                <Text style={styles.partnerText}>
                  {deal.partner?.storeName}
                </Text>
                <Text style={styles.description}>{deal.description}</Text>
                <Text style={styles.description}>{deal.tier}</Text>
                <Text style={styles.discountText}>
                  Discount: {deal.discount}%
                </Text>
                <Text style={styles.pointsText}>
                  Points Redeemed: {deal.redemptionPoints}
                </Text>
                <Text style={styles.expiryText}>Expires on: {expiry}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  noDealsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  dealCard: {
    flexDirection: "row", // Arrange image and content side by side
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dealImage: {
    width: 100,
    height: 160,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  dealContent: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  partnerText: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  discountText: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "600",
    marginBottom: 5,
  },
  pointsText: {
    fontSize: 14,
    color: "#dc3545",
    marginBottom: 5,
  },
  expiryText: {
    fontSize: 12,
    color: "#888",
  },
});

export default MyDeals;
