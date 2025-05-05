import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getUserPoints } from "../../redux/actions/pointsAction";

const History = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((state) => state.points);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getUserPoints()).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ flex: 1, justifyContent: "center" }}
        />
      ) : (
        <>
          <Text style={styles.screenTitle}>History</Text>
          {transactions?.length > 0 ? (
            transactions.map((txn) => {
              const isEarn = txn.type === "earn";
              const showPartner = txn.partner && txn.partner.storeName;

              return (
                <View
                  key={txn._id}
                  style={[
                    styles.transactionCard,
                    isEarn ? styles.earnCard : styles.redeemCard,
                  ]}
                >
                  <View style={styles.row}>
                    <Text style={styles.amountText}>
                      {isEarn ? "+" : "-"} {txn.amount} pts
                    </Text>
                    <Text style={styles.typeBadge}>
                      {isEarn ? "Earned" : "Redeemed"}
                    </Text>
                  </View>

                  <Text style={styles.description}>{txn.description}</Text>

                  {txn.deal && (
                    <Text style={styles.dealTitle}>Deal: {txn.deal.title}</Text>
                  )}

                  {showPartner && (
                    <Text style={styles.partnerText}>
                      Partner: {txn.partner.storeName}
                    </Text>
                  )}

                  <Text style={styles.dateText}>
                    Date: {new Date(txn.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.expiryText}>
                    Expires: {new Date(txn.expiresAt).toLocaleDateString()}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No transactions found.
            </Text>
          )}
        </>
      )}
    </ScrollView>
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
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 5,
  },
  earnCard: {
    borderLeftColor: "#28a745", // Green
  },
  redeemCard: {
    borderLeftColor: "#dc3545", // Red
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  typeBadge: {
    backgroundColor: "#007bff",
    color: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  partnerText: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  expiryText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});

export default History;
