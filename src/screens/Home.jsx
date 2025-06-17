import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Linking,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import motor1 from "../../assets/motor1.jpg";
import motor2 from "../../assets/motor2.jpg";
import motor3 from "../../assets/motor3.jpg";

const { width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { deals } = useSelector((state) => state.deals);
  const { products } = useSelector((state) => state.products);
  const { points, loyaltyTier } = useSelector((state) => state.points);
  const expiresAt = useSelector((state) =>
    state.points?.transactions?.length > 0
      ? state.points.transactions[0].expiresAt
      : null
  );
  const [posts, setPosts] = useState([]);
  const carouselImages = [motor1, motor2, motor3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://jabbre.shop/wp-json/wp/v2/posts?_embed"
        );
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const openPost = (link) => {
    Linking.openURL(link);
  };

  // Renders each blog post item
  const renderPostItem = ({ item }) => {
    const title = item?.title?.rendered || "No Title";
    const link = item?.link || "#";
    const imageUrl = item._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() => openPost(link)}
      >
        <Image
          source={{ uri: imageUrl || "https://via.placeholder.com/350x150" }}
          style={styles.postImage}
        />
        <Text style={styles.postTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const renderStores = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.storeBox}
        onPress={() => navigation.navigate("PartnerDetails", { item })}
      >
        {item.avatar?.url && (
          <Image source={{ uri: item.avatar.url }} style={styles.storeImage} />
        )}
        <Text style={styles.storeLabel}>{item.storeName}</Text>
      </TouchableOpacity>
    );
  };

  const renderDeals = ({ item }) => {
    const imageUrl = item.images?.[0]?.url || "https://via.placeholder.com/60";

    return (
      <TouchableOpacity
        style={styles.productBox}
        onPress={() => navigation.navigate("DealDetails", { item, partner: false })}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 100, height: 60, borderRadius: 8, marginBottom: 10 }}
        />
        <Text style={styles.productValue}>{item.title}</Text>
        <Text style={styles.productLabel}>{item.redemptionPoints} pts</Text>
        <Text style={styles.productLabel}>{item.tier}</Text>
      </TouchableOpacity>
    );
  };

  const allProducts = products.flatMap((store) =>
    store.productService.map((service) => ({
      ...service,
    }))
  );

  const renderProductServiceItem = ({ item }) => {
    const imageUrl = item.images?.[0]?.url || "https://via.placeholder.com/60";

    return (
      <TouchableOpacity
        style={styles.productBox}
        onPress={() => navigation.navigate("ProductDetails", { item })}
      >
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 100, height: 60, borderRadius: 8, marginBottom: 10 }}
        />
        <Text style={styles.productValue}>₱{item.price}</Text>
        <Text style={styles.productLabel}>{item.name}</Text>
        <Text style={styles.productLabel}>{item.types}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.bodyContainer}>
        {/* Horizontal Banners */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScrollContainer}
        >
          <View style={styles.carouselWrapper}>
            <Image
              source={carouselImages[currentIndex]}
              style={styles.carouselImage}
            />
          </View>
        </ScrollView>

        {/* Points + QR Container */}
        <View style={styles.rewardsCard}>
          <View style={styles.rewardsLeft}>
            <Text style={styles.rewardsTitle}>REWARDS POINTS</Text>
            <Text style={styles.rewardsPoints}>
              {(points || 0).toFixed(2)}PTS
            </Text>
            <Text style={styles.rewardsExpiry}>
              {expiresAt
                ? new Date(expiresAt).toLocaleDateString("en-US")
                : "No Points Yet"}
            </Text>
          </View>

          <View style={styles.rewardsRight}>
            <TouchableOpacity
              style={styles.viewHistoryButton}
              onPress={() => navigation.navigate("History")}
            >
              <Text style={styles.viewHistoryText}>VIEW REWARDS HISTORY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Deals")}
              style={styles.redeemContainer}
            >
              <Ionicons name="gift-outline" size={30} color="#000" />
              <Text style={styles.redeemLabel}>REDEEM POINTS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DEALS */}
        <View style={styles.productContainer}>
          <View style={styles.storeHeader}>
            <Text style={styles.productTitle}>DEALS</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Deals")}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productRow}>
            <FlatList
              data={deals}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderDeals}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10 }}
            />
          </View>
        </View>

        {/* SERVICES SECTION */}
        <View style={styles.storeContainer}>
          <View style={styles.storeHeader}>
            <Text style={styles.storeTitle}>PARTNER MERCHANT</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AllStores")}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderStores}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalStoreRow}
          />
        </View>

        {/* PRODUCTS */}
        <View style={styles.productContainer}>
          <View style={styles.storeHeader}>
            <Text style={styles.productTitle}>PRODUCTS & SERVICES</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllProducts")}
            >
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productRow}>
            <FlatList
              data={allProducts.slice(0, 3)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderProductServiceItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10 }}
            />
          </View>
        </View>

        {/* LATEST BLOGS (Horizontally scrollable) */}
        <View style={styles.blogContainer}>
          <Text style={styles.blogTitle}>LATEST BLOGS</Text>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPostItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.blogList}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

//Dark Version
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  bodyContainer: {
    paddingBottom: 20,
  },

  bannerScrollContainer: {
    marginTop: -20,
  },
  bannerItem: {
    width: width * 0.9,
    height: width * 0.45,
    marginHorizontal: 10,
    overflow: "hidden",
    backgroundColor: "#98DB52", // green
    position: "relative",
  },
  rewardsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    flexDirection: "row",
    padding: 16,
    marginHorizontal: 10,
    marginTop: -10,
    justifyContent: "space-between",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  rewardsLeft: {
    flex: 1,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000", // white
    marginBottom: 4,
  },
  rewardsPoints: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000000", // white
  },
  rewardsExpiry: {
    fontSize: 12,
    color: "#000000", // white
    marginTop: 4,
  },
  rewardsRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  viewHistoryButton: {
    backgroundColor: "#000000", // black
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  viewHistoryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  redeemContainer: {
    alignItems: "center",
  },
  redeemLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 4,
  },

  productContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productBox: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    padding: 20,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  productLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },

  storeContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  viewAllText: {
    fontSize: 14,
    color: "#000", // green for links
  },
  storeIconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  storeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10, // <-- spacing between image and text
    justifyContent: "center",
    alignItems: "center",
  },

  storeLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },

  blogContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  blogList: {},
  postContainer: {
    marginRight: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DBE2E9",
    width: width * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  postImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  postTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  carouselWrapper: {
    width: width,
    height: width * 0.5,
    marginBottom: 20,
  },
  carouselImage: {
    width: "100%",
    height: "200%",
    resizeMode: "cover",
  },
  horizontalStoreRow: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});
