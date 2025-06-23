import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { getUserFromQr } from "../../redux/actions/qrcodeAction";
import { resetData } from "../../redux/slices/qrSlice";
import { earnPoints } from "../../redux/actions/pointsAction";
import { resetGivenPoints } from "../../redux/slices/pointSlice";
import { sendSingleUserNotif } from "../../redux/actions/notifAction";
import { markDealAsUsed } from "../../redux/actions/dealsAction";

const ScannedQR = ({ scannedQR, setScanned }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.qrCode);
  const { message, givenPoints, error } = useSelector((state) => state.points);
  const { partner } = useSelector((state) => state.partners);
  const [amount, setAmount] = useState("");
  const [isDealQR, setIsDealQR] = useState(false);
  const [dealItem, setDealItem] = useState(false);

  useEffect(() => {
    if (scannedQR) {
      let parsed = null;
      try {
        parsed = JSON.parse(scannedQR);
      } catch {
        // Not a JSON object, proceed with raw string
      }

      if (parsed && typeof parsed === "object" && parsed.code) {
        setIsDealQR(true);
        setDealItem(parsed.dealItem);
        dispatch(getUserFromQr(parsed.code));
      } else {
        setIsDealQR(false);
        dispatch(getUserFromQr(scannedQR));
      }
    }
  }, [dispatch, scannedQR]);

  useEffect(() => {
    if (message && givenPoints) {
      Alert.alert("Success", `${message} \nPoints given ${givenPoints}`);
    }
  }, [message, givenPoints]);

  useEffect(() => {
    if (error) {
      Alert.alert("Failed", "Failed to give points to the user");
    }
  }, [error]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(resetData());
        dispatch(resetGivenPoints());
      };
    }, [dispatch])
  );

  const handleRewardSubmit = () => {
    const pointsData = {
      qrCode: scannedQR,
      amount: Number(amount),
    };

    dispatch(earnPoints(pointsData)).then((res) => {
      const notifData = {
        userId: data?.user?._id,
        title: "Gained Points",
        body: `You have gained ${res.payload.points} points from ${partner?.storeName}`,
      };
      dispatch(sendSingleUserNotif(notifData));
    });
  };

  const handleDealQR = () => {
    const dealData = {
      userId: data?.user?._id,
      dealId: dealItem._id,
    };

    dispatch(markDealAsUsed(dealData)).then(() => {
      const notifData = {
        userId: data?.user?._id,
        title:
          dealItem.discount !== null ? "Used Deal!" : "Loyalty Card Stamped",
        body:
          dealItem.discount !== null
            ? `You have used the ${dealItem.title} deal from ${partner?.storeName}`
            : `Your ${dealItem.title} deal from ${partner?.storeName} has been stamped`,
      };
      dispatch(sendSingleUserNotif(notifData)).then(()=> {
        Alert.alert("Success", "The deal is used");
      });
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>
        {isDealQR ? "Use deal" : "Reward Points"}
      </Text>
      {data && data.user ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>User: {data.user.name}</Text>
          <Text style={styles.resultText}>Email: {data.user.email}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No user data found</Text>
      )}

      {!isDealQR && (
        <TextInput
          style={styles.input}
          placeholder="Enter transaction amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      )}

      {isDealQR && dealItem && (
        <View style={styles.dealCard}>
          <Text style={styles.dealTitle}>{dealItem.title}</Text>
          <Text style={styles.dealStore}>
            From: {dealItem.partner.storeName}
          </Text>

          <View style={styles.imageContainer}>
            {dealItem.images.map((img) => (
              <Image
                key={img._id}
                source={{ uri: img.url }}
                style={styles.dealImage}
              />
            ))}
          </View>
          {dealItem.discount === null && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginVertical: 10,
              }}
            >
              {(() => {
                const total = dealItem.stampInfo?.stamp || 0;
                const freeCount = dealItem.stampInfo?.free || 0;
                const filled = dealItem.stampedCount || 0;

                const getFreeIndices = (total, freeCount) => {
                  if (freeCount <= 0) return [];
                  const interval = total / freeCount;
                  return Array.from(
                    { length: freeCount },
                    (_, i) => Math.round((i + 1) * interval) - 1
                  );
                };

                const freeIndices = getFreeIndices(total, freeCount);

                return Array.from({ length: total }).map((_, index) => {
                  const isFilled = index < filled;
                  const isFree = freeIndices.includes(index);

                  return (
                    <View
                      key={index}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 30,
                        backgroundColor: isFilled ? "#28a745" : "#e0e0e0",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 4,
                        borderWidth: isFree ? 2 : 0,
                        borderColor: isFree ? "gold" : "transparent",
                      }}
                    >
                      <Text style={{ fontSize: 10 }}>
                        {isFree ? "FREE" : "STAMP"}
                      </Text>
                    </View>
                  );
                });
              })()}
            </View>
          )}

          <Text style={styles.dealInfo}>
            Points Required: {dealItem.redemptionPoints}
          </Text>
          <Text style={styles.dealInfo}>Tier: {dealItem.tier}</Text>
          <Text style={styles.dealInfo}>
            Expires on: {new Date(dealItem.expiryDate).toLocaleDateString()}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={isDealQR ? handleDealQR : handleRewardSubmit}
      >
        <Text style={styles.buttonText}>
          {isDealQR ? "Use deal" : "Submit"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
        <Text style={styles.buttonText}>Scan Another QR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dealCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "flex-start",
  },
  dealTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  dealStore: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#34495e",
  },
  dealDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  dealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  dealInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
});

export default ScannedQR;
