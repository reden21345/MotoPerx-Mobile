import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { homeStyles as styles } from "../styles/HomeStyles";
import { getQRCode } from "../redux/actions/qrcodeAction";
import { getUserPoints } from "../redux/actions/pointsAction";
import { getAllProducts } from "../redux/actions/productAction";
import { getAllDeals } from "../redux/actions/dealsAction";
import { getHomePosts } from "../redux/actions/postAction";
import { getCommunitiesForUser } from "../redux/actions/communityAction";
import { getAllAds } from "../redux/actions/adsAction";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { deals } = useSelector((state) => state.deals);
  const { products } = useSelector((state) => state.products);
  const { points } = useSelector((state) => state.points);
  const { activeAds } = useSelector((state) => state.ads);
  const expiresAt = useSelector((state) =>
    state.points?.transactions?.length > 0
      ? state.points.transactions[0].expiresAt
      : null
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [randomizedDeals, setRandomizedDeals] = useState([]);
  const [randomizedProducts, setRandomizedProducts] = useState([]);
  const [randomizedStores, setRandomizedStores] = useState([]);

  // Function to randomize and limit items to 3
  const getRandomItems = (array, count = 3) => {
    if (!array || array.length === 0) return [];
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  };

  // Initialize randomized data
  const initializeData = useCallback(() => {
    setRandomizedDeals(getRandomItems(deals, 3));
    setRandomizedStores(getRandomItems(products, 3));

    const allProducts = products.flatMap((store) =>
      store.productService.map((service) => ({
        ...service,
      }))
    );
    setRandomizedProducts(getRandomItems(allProducts, 3));
  }, [deals, products]);

  // Initialize data when deals or products change
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Carousel auto-rotation for ads
  useEffect(() => {
    if (!activeAds || activeAds.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === activeAds.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // change slide every 3 seconds

    return () => clearInterval(interval);
  }, [activeAds]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      // Dispatch all actions to refresh data
      await Promise.all([
        dispatch(getQRCode()),
        dispatch(getUserPoints()),
        dispatch(getAllProducts()),
        dispatch(getAllDeals()),
        dispatch(getHomePosts()),
        dispatch(getCommunitiesForUser()),
        dispatch(getAllAds()),
      ]);

      initializeData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, initializeData]);

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

  // Get current ad image URL or fallback
  const getCurrentAdImage = () => {
    if (!activeAds || activeAds.length === 0) {
      return "https://via.placeholder.com/800x400?text=No+Active+Ads";
    }
    return (
      activeAds[currentIndex]?.images?.url ||
      "https://via.placeholder.com/800x400"
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.bodyContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#98DB52"]}
            tintColor="#98DB52"
          />
        }
      >
        {/* Dynamic Ad Banner Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScrollContainer}
        >
          <View style={styles.carouselWrapper}>
            <Image
              source={{ uri: getCurrentAdImage() }}
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

        {/* DEALS - Randomized 3 items */}
        {randomizedDeals.length > 0 && (
          <View style={styles.productContainer}>
            <View style={styles.storeHeader}>
              <Text style={styles.productTitle}>DEALS</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Deals")}>
                <Text style={styles.viewAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productRow}>
              <FlatList
                data={randomizedDeals}
                keyExtractor={(item, index) => `deal-${item._id || index}`}
                renderItem={renderDeals}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
              />
            </View>
          </View>
        )}

        {/* PARTNER MERCHANTS - Randomized 3 items */}
        {randomizedStores.length > 0 && (
          <View style={styles.storeContainer}>
            <View style={styles.storeHeader}>
              <Text style={styles.storeTitle}>PARTNER MERCHANT</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AllStores")}
              >
                <Text style={styles.viewAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={randomizedStores}
              keyExtractor={(item) => `store-${item._id}`}
              renderItem={renderStores}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalStoreRow}
            />
          </View>
        )}

        {/* PRODUCTS & SERVICES - Randomized 3 items */}
        {randomizedProducts.length > 0 && (
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
                data={randomizedProducts}
                keyExtractor={(item, index) => `product-${item._id || index}`}
                renderItem={renderProductServiceItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
              />
            </View>
          </View>
        )}

        {/* RIDER GAMES SECTION */}
        <View style={styles.gamesSection}>
          <View style={styles.gamesGradient}>
            <View style={styles.gamesHeader}>
              <Ionicons name="game-controller" size={40} color="#FFF" />
              <View style={styles.gamesHeaderText}>
                <Text style={styles.gamesTitle}>RIDER GAMES</Text>
                <Text style={styles.gamesSubtitle}>
                  Test Your Skills & Win Rewards
                </Text>
              </View>
            </View>

            <View style={styles.gamesIconRow}>
              <View style={styles.gameIconItem}>
                <Ionicons name="flash" size={24} color="#FFF" />
              </View>
              <View style={styles.gameIconItem}>
                <Ionicons name="book" size={24} color="#FFF" />
              </View>
              <View style={styles.gameIconItem}>
                <Ionicons name="speedometer" size={24} color="#FFF" />
              </View>
            </View>

            <TouchableOpacity
              style={styles.playGamesButton}
              onPress={() => navigation.navigate("GameMenu")}
            >
              <Text style={styles.playGamesButtonText}>PLAY GAMES</Text>
              <Ionicons name="arrow-forward" size={20} color="#98DB52" />
            </TouchableOpacity>

            <View style={styles.gamesFeaturesList}>
              <View style={styles.gamesFeatureItem}>
                <Ionicons name="trophy" size={16} color="#FFD700" />
                <Text style={styles.gamesFeatureText}>
                  Compete for High Scores
                </Text>
              </View>
              <View style={styles.gamesFeatureItem}>
                <Ionicons name="people" size={16} color="#FFD700" />
                <Text style={styles.gamesFeatureText}>
                  Challenge Other Riders
                </Text>
              </View>
              <View style={styles.gamesFeatureItem}>
                <Ionicons name="gift" size={16} color="#FFD700" />
                <Text style={styles.gamesFeatureText}>
                  Earn Exclusive Rewards
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
