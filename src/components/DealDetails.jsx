import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const DealDetails = ({ route, navigation }) => {
  const { item } = route.params;
  const handleBack = () => {
    navigation.goBack();
  };

  const isService = item?.category === "Service";
  const isProduct = item?.category === "Product";

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case "bronze":
        return "#cd7f32";
      case "silver":
        return "#c0c0c0";
      case "gold":
        return "#ffd700";
      default:
        return "#ccc";
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button - stays fixed */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <View style={styles.backIconWrapper}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </View>
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Avatar & Carousel */}
        <View style={styles.card}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
            {item?.images.map((img) => (
              <Image
                key={img._id}
                source={{ uri: img.url }}
                style={styles.image}
              />
            ))}
          </ScrollView>

          {/* Carousel Dots */}
          <View style={styles.dotsContainer}>
            {item?.images.map((_, index) => (
              <View key={index} style={styles.dot} />
            ))}
          </View>
        </View>

        {/* Points and Tier Badge */}
        <View style={styles.pointsTierRow}>
          <View style={styles.pointsTag}>
            <Ionicons name="pricetag" size={14} color="#333" />
            <Text style={styles.pointsText}>{item?.redemptionPoints} pts</Text>
          </View>

          <View
            style={[
              styles.tierBadge,
              { backgroundColor: getTierColor(item?.tier) },
            ]}
          >
            <Ionicons name="ribbon" size={16} color="#000" />
            <Text style={styles.tierText}>{item?.tier}</Text>
          </View>
        </View>

        <Text style={styles.name}>{item?.title}</Text>

        {/* Type */}
        <Text style={styles.label}>Category:</Text>
        <View style={styles.typeRow}>
          <View
            style={[styles.typeButton, isService && styles.activeTypeButton]}
          >
            <FontAwesome5 name="tools" size={16} color="#333" />
            <Text style={styles.typeText}>Services</Text>
          </View>
          <View
            style={[styles.typeButton, isProduct && styles.activeTypeButton]}
          >
            <MaterialCommunityIcons name="cube" size={18} color="#333" />
            <Text style={styles.typeText}>Products</Text>
          </View>
        </View>

        {/* Discount */}
        <Text style={styles.label}>Discount:</Text>
        <Text style={styles.description}>{item?.discount}%</Text>

        {/* Description */}
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.description}>{item?.description}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContainer: {
    paddingBottom: 40, 
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backIconWrapper: {
    backgroundColor: "#98DB52",
    padding: 8,
    borderRadius: 50,
  },
  card: {
    height: 300,
    backgroundColor: "#ddd",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: screenWidth,
    height: 300,
    resizeMode: "cover",
  },
  carousel: {
    flexGrow: 0,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e4dcdc",
    marginHorizontal: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#98DB52",
    textAlign: "center",
    width: "100%",
    marginTop: 8,
  },
  label: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 20,
    color: "#98DB52",
  },
  typeRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  activeTypeButton: {
    backgroundColor: "#98DB52",
  },
  typeText: {
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    paddingHorizontal: 20,
  },
  pointsTierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  pointsTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  pointsText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  tierText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
});

export default DealDetails;
