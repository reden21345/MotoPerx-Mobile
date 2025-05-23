import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getPartner } from "../../redux/actions/partnerAction";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";

const PartnerDashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { partner, loading, error } = useSelector((state) => state.partners);
  const { user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(getPartner());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const getAddress = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        setAddress("Permission denied");
        return;
      }

      const region = {
        latitude: partner?.location?.coordinates[1],
        longitude: partner?.location?.coordinates[0],
      };

      try {
        const response = await Location.reverseGeocodeAsync(region);
        if (response && response.length > 0) {
          const { street, city, region: state, postalCode } = response[0];
          setAddress(`${street}, ${city}, ${state} ${postalCode}`);
        }
      } catch (error) {
        console.warn("Failed to reverse geocode:", error);
        setAddress("Unknown");
      }
    };

    getAddress();
  }, [partner]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getPartner()).finally(() => setRefreshing(false));
  };

  if (loading || !partner) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  if (!partner && !loading) {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.loader}>
          <Text style={{ color: "#999" }}>No partner data available.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerCard}>
        <Image
          source={{
            uri:
              partner && partner.avatar && partner.avatar.url
                ? partner.avatar.url
                : "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.storeName}>{partner.storeName}</Text>
          <Text style={styles.subtext} numberOfLines={2} ellipsizeMode="tail">
            {address}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow icon="check-decagram" label="Status" value={partner.status} />
        <InfoRow
          icon="account-group"
          label="Total Customers"
          value={partner.totalCustomers}
        />
        <InfoRow
          icon="cash-multiple"
          label="Total Points Given"
          value={partner.totalPointsGiven.toFixed(2)}
        />
        <InfoRow
          icon="gift"
          label="Total Redemptions"
          value={partner.totalRedemptions.toFixed(2)}
        />
      </View>
      {user?.role === "partner" && (
        <ManageRow
          icon="account-multiple"
          label="Employees"
          value={partner.employees}
          navigation={navigation}
        />
      )}

      <ManageRow
        icon="cube-outline"
        label="Products/Services"
        value={partner.productService}
        navigation={navigation}
      />
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={22} color="#007bff" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const ManageRow = ({ icon, label, value, navigation }) => (
  <TouchableOpacity
    style={styles.manageCard}
    onPress={() => {
      if (label === "Employees") {
        navigation.navigate("Employees");
      } else {
        navigation.navigate("Products");
      }
    }}
  >
    <View style={styles.manageHeader}>
      <Icon name={icon} size={20} color="#007bff" />
      <Text style={styles.manageText}>
        View All ({value.length}) {label}
      </Text>
    </View>
    <Text style={styles.linkText}>Tap to manage ➝</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f4f7",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: "#ddd",
  },
  storeName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    flexWrap: "wrap",
    maxWidth: 200,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  manageCard: {
    backgroundColor: "#e6f0ff",
    borderRadius: 16,
    padding: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  manageHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  manageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginLeft: 10,
  },
  linkText: {
    marginTop: 8,
    fontSize: 14,
    color: "#007bff",
  },
});

export default PartnerDashboard;
