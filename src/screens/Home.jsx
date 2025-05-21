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
import ProductComponent from "../components/ProductComponent";
import PartnerComponent from "../components/PartnerComponent";

const { width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { points, loyaltyTier } = useSelector((state) => state.points);
  const [posts, setPosts] = useState([]);
  const [comp, setComp] = useState("Home");
  const [item, setItem] = useState(null)

  useEffect(() => {
    // Fetch blog posts
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://jabbre.shop/wp-json/wp/v2/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, [dispatch]);


  const openPost = (link) => {
    Linking.openURL(link);
  };

  // Renders each blog post item
  const renderPostItem = ({ item }) => {
    const title = item?.title?.rendered || "No Title";
    const link = item?.link || "#";

    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() => openPost(link)}
      >
        <Image
          source={{ uri: "https://via.placeholder.com/350x150" }}
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
        onPress={() => {
          setItem(item);
          setComp("Partner")
        }}
      >
        {item.avatar?.url && (
          <Image source={{ uri: item.avatar.url }} style={styles.storeBox} />
        )}
      </TouchableOpacity>
    );
  };

  const renderProductServiceItem = ({ item }) => {
    const imageUrl = item.images?.[0]?.url || "https://via.placeholder.com/60";

    return (
      <TouchableOpacity
        style={styles.productBox}
        onPress={() => {
          setItem(item);
          setComp("ProductDetails")
        }}
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

  const allProducts = products.flatMap((store) =>
    store.productService.map((service) => ({
      ...service,
    }))
  );

  return (
    <View style={styles.container}>
      {comp === "Home" ? (
        <ScrollView contentContainerStyle={styles.bodyContainer}>
          {/* Horizontal Banners */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScrollContainer}
          >
            {/* FIRST BANNER */}
            <View style={styles.bannerItem}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/400x200?text=BEST+CAR+SERVICE",
                }}
                style={styles.bannerBg}
              />
              <View style={styles.freeCarWashBubble}>
                <Text style={styles.freeCarWashText}>FREE CAR WASH</Text>
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerMainText}>BEST CAR SERVICE</Text>
                <View style={styles.bulletPoints}>
                  <Text style={styles.bulletText}>• Oil Changes</Text>
                  <Text style={styles.bulletText}>• Fluid Checks</Text>
                  <Text style={styles.bulletText}>• Tire Rotations</Text>
                  <Text style={styles.bulletText}>• Repair</Text>
                  <Text style={styles.bulletText}>• Engine Diagnostics</Text>
                </View>
                <Text style={styles.contactText}>
                  CONTACT US: +23-456-7980 (Mr. Alfredo)
                </Text>
              </View>
            </View>

            {/* SECOND BANNER */}
            <View style={styles.bannerItem}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/400x200?text=CAR+WASH+AND+DETAIL",
                }}
                style={styles.bannerBg}
              />
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerMainText}>CAR WASH AND DETAIL</Text>
                <Text style={styles.bulletText}>• Standard Car Wash</Text>
                <Text style={styles.bulletText}>• Interior Cleaning</Text>
                <Text style={styles.bulletText}>• Full Services Wash</Text>
                <TouchableOpacity
                  style={styles.contactUsBtn}
                  onPress={() => console.log("Contact us pressed")}
                >
                  <Text style={styles.contactUsBtnText}>CONTACT US</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Points + QR Container */}
          <View style={styles.pointsRowContainer}>
            {/* Points Balance Card */}
            <View style={styles.pointsBalanceCard}>
              <Ionicons name="card-outline" style={styles.walletIcon} />
              <View style={styles.pointsTextWrapper}>
                <Text style={styles.pointsBalanceTitle}>
                  MOTOPERX POINTS BALANCE
                </Text>
                <Text style={styles.pointsBalanceValue}>
                  {(points || 0).toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.redeemButton}
                onPress={() => navigation.navigate("Deals")}
              >
                <Text style={styles.redeemButtonText}>+ REDEEM</Text>
              </TouchableOpacity>
            </View>

            {/* QR Code Button/Icon */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.qrContainer}
            >
              <Ionicons name="qr-code-outline" size={32} color="#000" />
            </TouchableOpacity>
          </View>

          {/* POINTS PER SERVICES */}
          <View style={styles.productContainer}>
            <View style={styles.storeHeader}>
              <Text style={styles.productTitle}>PRODUCTS / SERVICES</Text>
              <TouchableOpacity onPress={() => navigation.navigate("AllProducts")}>
                <Text style={styles.viewAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productRow}>
              <FlatList
                data={allProducts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProductServiceItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
              />
            </View>
          </View>

          {/* SERVICES SECTION */}
          <View style={styles.storeContainer}>
            <View style={styles.storeHeader}>
              <Text style={styles.storeTitle}>PARTNER STORES</Text>
              <TouchableOpacity onPress={() => navigation.navigate("AllStores")}>
                <Text style={styles.viewAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={renderStores}
              contentContainerStyle={styles.storeIconRow}
            />
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
      ) : comp === "ProductDetails" ? (
        <ProductComponent item={item} setComp={setComp} setItem={setItem}/>
      ) : (
        <PartnerComponent item={item} setComp={setComp} setItem={setItem}/>
      )}
    </View>
  );
};

export default Home;

/* ======================
   STYLES
   ====================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /****************
   * SCROLL BODY
   ****************/
  bodyContainer: {
    paddingBottom: 20,
  },

  /****************************
   * HORIZONTAL SCROLL BANNERS
   ****************************/
  bannerScrollContainer: {
    marginTop: 10,
  },
  bannerItem: {
    width: width * 0.9,
    height: width * 0.45,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ccc",
    position: "relative",
  },
  bannerBg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerTextContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
  },
  bannerMainText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  bulletPoints: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 4,
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 2,
  },
  contactText: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: "#000",
  },
  freeCarWashBubble: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#ffc107",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  freeCarWashText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 12,
  },
  contactUsBtn: {
    backgroundColor: "#ff0000",
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  contactUsBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  /********************************
   * POINTS BALANCE + QR CONTAINER
   ********************************/
  pointsRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    // Adjust spacing as needed
  },
  pointsBalanceCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    // Optional shadow to pop out the card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
    marginRight: 10, // space before QR code
  },
  walletIcon: {
    fontSize: 28,
    color: "#000",
    marginRight: 8,
  },
  pointsTextWrapper: {
    flex: 1,
  },
  pointsBalanceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  pointsBalanceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  redeemButton: {
    backgroundColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  qrContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // Optional shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },

  /**********************
   * PRODUCTS
   **********************/
  productContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productBox: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    padding: 15,
  },
  productValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  productLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },

  /****************
   * STORES
   ****************/
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
  },
  viewAllText: {
    fontSize: 14,
    color: "#007bff",
  },
  storeIconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  storeBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  storeLabel: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },

  /**************
   * LATEST BLOGS
   **************/
  blogContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  blogList: {},
  postContainer: {
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    width: width * 0.8,
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
    color: "#333",
  },
});
