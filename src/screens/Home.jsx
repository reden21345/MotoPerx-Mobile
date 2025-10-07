import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Linking,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { homeStyles as styles } from "../styles/HomeStyles";
import motor1 from "../../assets/makina.jpg";
import motor2 from "../../assets/unioil.png";
import motor3 from "../../assets/suzuki.jpg";
import motor4 from "../../assets/hjc.jpg";
import motor5 from "../../assets/Honda.png";
import motor6 from "../../assets/jabbre.png";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { deals } = useSelector((state) => state.deals);
  const { products } = useSelector((state) => state.products);
  const { homePosts } = useSelector((state) => state.posts);
  const { points, loyaltyTier } = useSelector((state) => state.points);
  const expiresAt = useSelector((state) =>
    state.points?.transactions?.length > 0
      ? state.points.transactions[0].expiresAt
      : null
  );
  const carouselImages = [motor1, motor2, motor3, motor4, motor5, motor6];
  const [currentIndex, setCurrentIndex] = useState(0);

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
    const title = item?.title || "No Title";
    const link = item?.link || "#";
    const imageUrl = item.images[0]?.url;

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
        onPress={() =>
          navigation.navigate("DealDetails", { item, partner: false })
        }
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
        <Text style={styles.productLabel}>{item.info?.category}</Text>
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
          <View style={styles.storeHeader}>
            <Text style={styles.blogTitle}>POSTS</Text>
            <TouchableOpacity onPress={() => navigation.navigate("HomePosts")}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={homePosts}
            keyExtractor={(item) => item._id.toString()}
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