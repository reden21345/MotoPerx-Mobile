import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { useSelector } from "react-redux";

const GpsLocation = () => {
  const [location, setLocation] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const fetchNearbyPartners = async (coords) => {
    try {
      const res = await axios.post(
        "https://motoperx-backend.onrender.com/api/partners/nearby",
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
        }
      );
      setPartners(res.data.partners || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission denied.");
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          const coords = { latitude, longitude };
          setLocation(coords);

          if (user?.role === "user") {
            fetchNearbyPartners(coords);
          }
        }
      );

      setLoading(false);
      return () => {
        locationSubscription.remove();
      };
    })();
  }, []);

  const renderPartner = ({ item }) => (
    <View style={styles.partnerCard}>
      <Image
        source={{ uri: item.avatar?.url || "https://i.imgur.com/6v3K2xM.png" }}
        style={styles.partnerLogo}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.partnerName}>{item.storeName || "Unknown Shop"}</Text>
        <Text style={styles.partnerDetails}>
          {item.location?.name || "No address"}
        </Text>
      </View>
    </View>
  );

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={{ marginTop: 10 }}>Tracking your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Nearby Partner Shops</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
      >
        {/* Marker for user */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You"
          pinColor="blue"
        />

        {/* Markers for nearby partners */}
        {partners.map((partner) => (
          <Marker
            key={partner._id}
            coordinate={{
              latitude: partner.location.coordinates[1],
              longitude: partner.location.coordinates[0],
            }}
            title={partner.storeName}
            description={partner.location?.name || ""}
          />
        ))}
      </MapView>

      <FlatList
        data={partners}
        keyExtractor={(item) => item._id}
        renderItem={renderPartner}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No nearby shops found.
          </Text>
        }
        contentContainerStyle={styles.partnerList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 15,
    color: "#222",
    backgroundColor: "#eee",
  },
  map: {
    height: 300,
    width: "100%",
  },
  partnerList: {
    padding: 10,
  },
  partnerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  partnerLogo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  partnerDetails: {
    fontSize: 13,
    color: "#666",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GpsLocation;