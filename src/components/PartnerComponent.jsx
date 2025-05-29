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
import { Linking } from "react-native";


const PartnerComponent = ({ item, setComp, setItem }) => {
  const handleBack = () => {
    setComp("Home");
    setItem(null);
  };

  const { storeName, avatar, conversion, location, productService } = item;

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coordinates[1],
            longitude: location.coordinates[0],
          }}
          title={storeName}
          onPress={() => {
            const lat = location.coordinates[1];
            const lng = location.coordinates[0];
            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            Linking.openURL(url);
          }}
        />
      </MapView>

      {/* Floating Overlay Card */}
      <View style={styles.overlay}>
        <View style={styles.handleBar} />

        {/* Store Info Section */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Image source={{ uri: avatar.url }} style={styles.avatar} />
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{storeName}</Text>
              <Text style={styles.conversion}>
                Conversion: ₱{conversion} = 1 pt
              </Text>
            </View>
          </View>
        </View>

        {/* Products & Services */}
        <Text style={styles.productsLabel}>PRODUCTS & SERVICES</Text>
        <View style={styles.productBox}>
          {productService.length > 0 ? (
            <FlatList
              data={productService}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <ProductCard item={item} />}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
            />

          ) : (
            <Text style={{ color: "#fff" }}>No products or services yet</Text>
          )}
        </View>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  map: {
    width: "100%",
    height: 450,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#000",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    paddingTop: 10,
  },
  handleBar: {
    alignSelf: "center",
    width: 60,
    height: 6,
    backgroundColor: "#ccc",
    borderRadius: 3,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#000000",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    shadowColor: "#FFFFFF",           
    shadowOffset: { width: 2, height: 8 }, 
    shadowOpacity: 0.75,             
    shadowRadius: 12,             
    elevation: 15,  
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: "#fff",
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  conversion: {
    fontSize: 14,
    color: "#fff",
  },
  productsLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
  },
  productBox: {
    backgroundColor: "#000000",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    shadowColor: "#FFFFFF",           
    shadowOffset: { width: 2, height: 8 }, 
    shadowOpacity: 0.75,             
    shadowRadius: 12,             
    elevation: 15,  
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
  },
});


export default PartnerComponent;
