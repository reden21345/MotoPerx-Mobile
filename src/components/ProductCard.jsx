import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";

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

const styles = StyleSheet.create({
  serviceBox: {
   // backgroundColor: "#fff",
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
});

export default ProductCard;