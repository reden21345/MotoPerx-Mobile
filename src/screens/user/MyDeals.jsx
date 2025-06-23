import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getRedeemedDeals } from "../../redux/actions/dealsAction";
import QRCode from "react-native-qrcode-svg";

const MyDeals = () => {
  const dispatch = useDispatch();
  const { redeemed, loading, error } = useSelector((state) => state.deals);
  const { qrCode } = useSelector((state) => state.qrCode);
  const { user } = useSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const [dealItem, setDealItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleUseDeal = (item) => {
    setDealItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setDealItem(null);
    setModalVisible(false);
  };

  const filteredDeals = redeemed.filter((deal) => deal.used !== true);

  const renderItem = ({ item }) => {
    const imageUrl = item.images?.[0]?.url || null;
    const expiry = new Date(item.expiryDate).toLocaleDateString();
    const isDiscount = item.discount !== null;
    const stampTotal = item.stampInfo?.stamp || 0;
    const stampFree = item.stampInfo?.free || 0;
    const filled = item.stampedCount || 0;

    const getFreeIndices = (total, freeCount) => {
      if (freeCount <= 0) return [];

      const interval = total / freeCount;
      return Array.from(
        { length: freeCount },
        (_, i) => Math.round((i + 1) * interval) - 1
      );
    };

    const freeIndices = getFreeIndices(stampTotal, stampFree);

    const stamps = Array.from({ length: stampTotal }, (_, index) => {
      const isFilled = index < filled;
      const isFree = freeIndices.includes(index);

      return (
        <View
          key={index}
          style={[
            styles.stampTire,
            isFilled && styles.stampFilled,
            isFree && styles.stampFree,
          ]}
        >
          <Text style={styles.stampText}>{isFree ? "FREE" : "STAMP"}</Text>
        </View>
      );
    });

    return (
      <TouchableOpacity
        key={item._id}
        style={styles.cardContainer}
        onPress={() => handleUseDeal(item)}
        disabled={item.used}
      >
        <Text style={styles.cardTitle}>
          {isDiscount ? "DISCOUNT CATEGORY" : "STAMP DEALS"}
        </Text>
        <Text style={styles.dealTitle}>{item.title}</Text>
        {isDiscount ? (
          <Text style={styles.discountText}>Discount: {item.discount}%</Text>
        ) : (
          <View style={styles.stampContainer}>{stamps}</View>
        )}
        <Text style={styles.pointsText}>
          Points Redeemed: {item.redemptionPoints}
        </Text>
        <Text style={styles.expiryText}>Expires on: {expiry}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.screenTitle}>Redeemed Deals</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : filteredDeals.length === 0 ? (
        <Text style={styles.noDealsText}>No redeemed deals found.</Text>
      ) : (
        <>
          <Modal
            transparent
            visible={modalVisible}
            animationType="fade"
            onRequestClose={closeModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                {qrCode?.code ? (
                  <QRCode
                    value={JSON.stringify({ code: qrCode.code, dealItem })}
                    size={250}
                  />
                ) : (
                  <Text style={styles.qrLabel}>QR Code Loading...</Text>
                )}
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <FlatList
            data={filteredDeals}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )}
    </KeyboardAvoidingView>
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
  list: {
    paddingBottom: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  discountText: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
  },
  pointsText: {
    fontSize: 14,
    color: "#dc3545",
    marginTop: 10,
  },
  expiryText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  stampContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
    columnGap: 10,
    rowGap: 10,
    width: "100%",
  },
  stampTire: {
    width: 38,
    height: 38,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  stampFilled: {
    backgroundColor: "#98DB52",
    borderColor: "#000",
  },
  stampFree: {
    borderColor: "#28a745",
    borderWidth: 3,
  },
  stampText: {
    fontSize: 8,
    color: "#000",
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#98DB52",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#000000",
    fontWeight: "600",
  },
});

export default MyDeals;
