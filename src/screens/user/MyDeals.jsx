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
    return (
      <TouchableOpacity
        key={item._id}
        style={styles.dealCard}
        onPress={() => handleUseDeal(item)}
        disabled={item.used}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.dealImage}
          resizeMode="cover"
        />
        <View style={styles.dealContent}>
          <Text style={styles.dealTitle}>{item.title}</Text>
          <Text style={styles.partnerText}>{item.partner?.storeName}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.description}>{item.tier}</Text>
          {isDiscount ? (
            <Text style={styles.discountText}>Discount: {item.discount}%</Text>
          ) : (
            <Text style={styles.discountText}>Stamped {item.stampedCount} time/s</Text>
          )}
          <Text style={styles.pointsText}>
            Points Redeemed: {item.redemptionPoints}
          </Text>
          <Text style={styles.expiryText}>Expires on: {expiry}</Text>
        </View>
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#FFFFFF", // white
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#000000", // black
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#98DB52", // green
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#000000", // black text for contrast
    fontWeight: "600",
  },
});

export default MyDeals;
