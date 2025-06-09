import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ProductCard = ({ item, compact = false }) => {
  const navigation = useNavigation();
  const [imageIndex, setImageIndex] = useState(0);
  const imageList = item.images || [];

  useEffect(() => {
    if (imageList.length > 1) {
      const interval = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [imageList]);

  if (compact) {
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
  }

  return (
    <View style={styles.serviceBox}>
      <View style={styles.topSection}>
        <View style={styles.textContainer}>
          <Text style={styles.value}>{item.name}</Text>
          <Text style={styles.value}>Type: {item.types}</Text>
          <Text style={styles.value}>Price: ₱{item.price}</Text>
          <Text style={styles.value}>Description: {item.description}</Text>
        </View>

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceBox: {
    width: Dimensions.get("window").width - 60,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
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
  value: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },

  // Grid styles
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
