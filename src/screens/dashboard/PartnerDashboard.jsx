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
  Dimensions
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getPartner } from "../../redux/actions/partnerAction";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getAddress } from "../../utils/helpers";

const screenWidth = Dimensions.get("window").width;

const PartnerDashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { partner, loading, error } = useSelector((state) => state.partners);
  const { user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [address, setAddress] = useState(null);
  const defaultSales = [
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 7000 },
    { month: "Mar", value: 6000 },
    { month: "Apr", value: 8000 },
    { month: "May", value: 9000 },
    { month: "Jun", value: 7500 },
  ];


  useEffect(() => {
    if (user) {
      dispatch(getPartner());
    }
  }, [dispatch, user]);

  useEffect(() => {
    getAddress(partner?.location?.coordinates, setAddress);
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
      {/* Profile Section */}
      <View style={styles.profileCard}>
      <Image
        source={{
          uri:
            partner && partner.avatar && partner.avatar.url
              ? partner.avatar.url
              : "https://via.placeholder.com/150",
        }}
        style={styles.avatar}
        />
        <View style={styles.profileText}>
          <Text style={styles.storeName}>{partner.storeName}</Text>
          <Text style={styles.subtext} numberOfLines={2} ellipsizeMode="tail">
            {address}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() =>
            navigation.navigate("EditPartner", { partner, admin: false })
          }
        >
          <Icon name="pencil" size={20} color="#98DB52" />
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsGrid}>
        <StatCard icon="account-group" label="Customers" value={partner.totalCustomers} />
        <StatCard icon="star" label="Total Points Given" value={partner.totalPointsGiven.toFixed(2)} />
        <StatCard icon="gift" label="Total Redemption" value={partner.totalRedemptions.toFixed(2)} />
      </View>

      {/* Manage Cards */}
      <View style={styles.manageRow}>
        {user?.role === "partner" && (
          <ManageCard
            icon="account-multiple"
            label="Employees"
            value={partner.employees?.length || 0}
            onPress={() => navigation.navigate("Employees")}
          />
        )}
        <ManageCard
          icon="cube-outline"
          label="Products/Services"
          value={partner.productService?.length || 0}
          onPress={() => navigation.navigate("Products")}
        />
      </View>

      {/* Monthly Sales Placeholder */}
      <View style={styles.salesGraph}>
        <Text style={styles.salesLabel}>MONTHLY SALES</Text>
        <View style={styles.barChartContainer}>
          {defaultSales.map((item, index) => (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  { height: item.value / 100 }, // adjust divisor for scaling
                ]}
              />
              <Text style={styles.barLabel}>{item.month}</Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>

  );
};

const StatCard = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    <Icon name={icon} size={28} color="#98DB52" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
  </View>
);

const ManageCard = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.manageCard} onPress={onPress}>
    <View style={styles.manageCardContent}>
      <Icon name={icon} size={24} color="#98DB52" />
      <Text style={styles.manageText}>{value}</Text>
      <Text style={styles.manageLabel}>{label.toUpperCase()}</Text>
      <Icon name="chevron-right" size={20} color="#98DB52" />
    </View>
  </TouchableOpacity>
);

//Dark Version
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#000",
    flexGrow: 1,
    paddingBottom: 32,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  profileCard: {
    backgroundColor: "#000", // fixed
    borderRadius: 12,
    borderColor: "#98DB52",
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: (screenWidth * 0.15) / 2,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  storeName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  subtext: {
    fontSize: 12,
    color: "#fff",
  },
  editIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 8,
    backgroundColor: "#000",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "32%",
    backgroundColor: "#000",
    borderRadius: 10,
    borderColor: "#98DB52",
    borderWidth: 2,
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    color: "#fff",
    marginTop: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  manageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  manageCard: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 10,
    borderColor: "#98DB52",
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 4,
  },
  manageCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  manageText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
    color: "#fff",
  },
  manageLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#fff",
  },
  salesGraph: {
    backgroundColor: "#000",
    borderColor: "#98DB52",
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    height: 200,
    justifyContent: "flex-end",
  },
  salesLabel: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 8,
  },
  barChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    marginTop: 8,
  },
  barWrapper: {
    alignItems: "center",
    width: 30,
  },
  bar: {
    width: 20,
    backgroundColor: "#98DB52",
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: "#fff",
    marginTop: 4,
  },
});


//Light Version
// const styles = StyleSheet.create({
//   container: {
//     padding: 12, // reduced from 20
//     backgroundColor: "#f7f9fc",
//     flex: 1,
//   },
//   profileCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     borderColor: "#4CAF50",
//     borderWidth: 1.5,
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 14, // reduced
//     marginBottom: 12, // tighter
//     shadowColor: "#4CAF50",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   avatar: {
//     width: 56, // reduced from 70
//     height: 56,
//     borderRadius: 28,
//     borderWidth: 1.5,
//     borderColor: "#4CAF50",
//     marginRight: 12,
//   },
//   profileText: {
//     flex: 1,
//     color: "#333",
//   },
//   storeName: {
//     fontWeight: "bold",
//     fontSize: 17, // smaller
//     color: "#4CAF50",
//     marginBottom: 2,
//   },
//   subtext: {
//     fontSize: 12, // smaller
//     color: "#666",
//   },
//   editIcon: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     color: "#fff",
//     borderRadius: 16,
//     padding: 6,
//     backgroundColor: "#4CAF50",
//   },
//   statsGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#e8f5e9",
//     borderRadius: 12,
//     borderColor: "#81c784",
//     borderWidth: 1.5,
//     alignItems: "center",
//     padding: 10,
//     marginHorizontal: 4,
//     elevation: 3,
//   },
//   statLabel: {
//     fontSize: 11,
//     color: "#388e3c",
//     marginTop: 4,
//     textAlign: "center",
//   },
//   statValue: {
//     fontSize: 17,
//     fontWeight: "bold",
//     color: "#2e7d32",
//   },
//   manageRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 10,
//   },
//   manageCard: {
//     flex: 1,
//     backgroundColor: "#fff3e0",
//     borderRadius: 12,
//     borderColor: "#ffb74d",
//     borderWidth: 1.5,
//     padding: 12,
//     marginHorizontal: 4,
//     elevation: 2,
//   },
//   manageCardContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   manageText: {
//     fontWeight: "bold",
//     fontSize: 14,
//     marginLeft: 6,
//     color: "#e65100",
//   },
//   manageLabel: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 12,
//     color: "#bf360c",
//   },
//   salesGraph: {
//     backgroundColor: "#e3f2fd",
//     borderColor: "#42a5f5",
//     borderWidth: 1.5,
//     borderRadius: 12,
//     padding: 14,
//     marginTop: 16,
//     height: 180, // reduced from 220
//     justifyContent: "flex-end",
//     elevation: 4,
//   },
//   salesLabel: {
//     fontSize: 13,
//     color: "#1976d2",
//     marginBottom: 6,
//   },
//   salesLine: {
//     height: 1.5,
//     backgroundColor: "#64b5f6",
//   },
//   barChartContainer: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     justifyContent: "space-between",
//     height: 120, // reduced
//     marginTop: 8,
//   },
//   barWrapper: {
//     alignItems: "center",
//     width: 26,
//   },
//   bar: {
//     width: 18,
//     backgroundColor: "#4CAF50",
//     borderRadius: 5,
//   },
//   barLabel: {
//     fontSize: 10,
//     color: "#2e7d32",
//     marginTop: 4,
//   },
// });
export default PartnerDashboard;
