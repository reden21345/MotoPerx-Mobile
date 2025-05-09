import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";

const PartnerDetails = ({ route }) => {
  const { item } = route.params;
  const {
    storeName,
    avatar,
    owner,
    location,
    status,
    totalCustomers,
    totalPointsGiven,
    totalRedemptions,
    conversion,
  } = item;

  const [longitude, latitude] = location.coordinates;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Partner Details</Text>

      <View style={styles.card}>
        <Image source={{ uri: avatar.url }} style={styles.avatar} />

        <Text style={styles.label}>Store Name:</Text>
        <Text style={styles.value}>{storeName}</Text>

        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{owner.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{owner.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{owner.phone}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{status}</Text>

        <Text style={styles.label}>Total Customers:</Text>
        <Text style={styles.value}>{totalCustomers}</Text>

        <Text style={styles.label}>Total Points Given:</Text>
        <Text style={styles.value}>{totalPointsGiven.toFixed(2)}</Text>

        <Text style={styles.label}>Total Redemptions:</Text>
        <Text style={styles.value}>{totalRedemptions}</Text>

        <Text style={styles.label}>Conversion Rate:</Text>
        <Text style={styles.value}>{conversion} pts = 1 PHP</Text>
      </View>

      <Text style={styles.sectionTitle}>📍 Store Location</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={storeName}
          description={`Owner: ${owner.name}`}
        />
      </MapView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f7",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#dff0fd",
    color: "#1a73e8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#222",
  },
  map: {
    height: 300,
    margin: 20,
    borderRadius: 12,
  },
});

export default PartnerDetails;
