import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProductCard = ({ item }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const imageList = item.images || [];
  const navigation = useNavigation();

  useEffect(() => {
    if (imageList.length > 1) {
      const interval = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [imageList]);

  return (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => navigation.navigate("ProductDetails", { item })}
    >
      {imageList.length > 0 ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageList[imageIndex].url }}
            style={styles.gridImage}
          />
        </View>
      ) : (
        <View style={styles.gridImagePlaceholder} />
      )}

      <Text style={styles.gridName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.gridPrice}>₱{item.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  gridCard: {
    backgroundColor: "#0000",
    width: "48%",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#98DB52",
    paddingBottom: 30,
  },
  gridImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#98DB52",
  },
  gridImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#ccc",
    marginBottom: 8,
  },
  gridName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
  },
  gridPrice: {
    fontSize: 13,
    color: "#fff",
  },
});

export default ProductCard;
