import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import ProductCard from "./ProductCard";

const PartnerComponent = ({ item, setComp, setItem }) => {
  const handleBack = () => {
    setComp("Home");
    setItem(null);
  };

  const { storeName, avatar, conversion, location, productService } = item;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Partner Details</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar & Store Info */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar.url }} style={styles.avatar} />
          <Text style={styles.storeName}>{storeName}</Text>
          <Text style={styles.conversion}>
            Conversion Rate: ₱{conversion} = 1 point
          </Text>
        </View>

        {/* Product/Service Info */}
        <Text style={styles.label}>Products/Services:</Text>
        {productService.length > 0 ? (
          <FlatList
            data={productService}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ProductCard item={item}/>}
          />
        ) : (<Text> No products or services yet </Text>)}

        {/* Map */}
        <Text style={[styles.label, { marginTop: 20 }]}>Store Location:</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coordinates[1],
            longitude: location.coordinates[0],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coordinates[1],
              longitude: location.coordinates[0],
            }}
            title={storeName}
          />
        </MapView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  conversion: {
    fontSize: 16,
    color: "#666",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    marginBottom: 3,
  },
  map: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default PartnerComponent;
