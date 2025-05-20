import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProductComponent = ({ item, setComp, setItem }) => {
  const handleBack = () => {
    setComp("Home");
    setItem(null);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Details</Text>

      {/* Product Images */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {item.images.map((img) => (
          <Image key={img._id} source={{ uri: img.url }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Product Info */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{item.name}</Text>

        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{item.types}</Text>

        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>₱{item.price}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginVertical: 20,
  },
  imageScroll: {
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 10,
    marginRight: 15,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ProductComponent;