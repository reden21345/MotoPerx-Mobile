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

const ProductCard = ({ item }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const imageList = item.images || [];

  const nextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  return (
    <View style={styles.serviceBox}>
      <View style={styles.topSection}>
        <View style={styles.textContainer}>
          <Text style={styles.value}>{item.name}</Text>
          <Text style={styles.value}>Type: {item.types}</Text>
          <Text style={styles.value}>Price: ₱{item.price}</Text>
          <Text style={styles.value}>
            Description: {item.description}
          </Text>
        </View>

        {imageList.length > 0 && (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={nextImage}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: imageList[imageIndex].url }}
              style={styles.dealImage}
            />
            {imageList.length > 1 && (
              <Text style={styles.imageIndex}>
                {imageIndex + 1}/{imageList.length}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

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
  serviceBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
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
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 2,
    paddingRight: 10,
  },
  imageIndex: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dealImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: "cover",
  },
});

export default PartnerComponent;
