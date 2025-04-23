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
import { getUserPoints } from "../redux/actions/pointsAction";

const { width } = Dimensions.get("window");

// Static services for "Points per Services"
const SERVICE_ITEMS = [
  { label: "Fuel Service", points: 10 },
  { label: "Accessories", points: 10 },
  { label: "Motor Wash", points: 10 },
  { label: "Change Oil", points: 10 },
];

const BannerItems = [
  { key: "1", title: "BEST CAR SERVICE", bg: "#F0F0F0" },
  { key: "2", title: "CAR WASH & DETAIL", bg: "#E0E0E0" },
];

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { points = 0 } = useSelector((state) => state.points);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    dispatch(getUserPoints());
    // Fetch posts with featured image
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "https://jabbre.shop/wp-json/wp/v2/posts?_embed"
        );
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [dispatch]);

  const openPost = (url) => Linking.openURL(url);

  const renderPostItem = ({ item }) => {
    const img =
      item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "https://via.placeholder.com/350x150?text=No+Image";
    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() => openPost(item.link)}
      >
        <Image source={{ uri: img }} style={styles.postImage} />
        <Text style={styles.postTitle}>{item.title.rendered}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        {/* Banner + Points Card */}
        <View style={styles.bannerWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScroll}
          >
            {BannerItems.map((b) => (
              <View
                key={b.key}
                style={[styles.banner, { backgroundColor: b.bg }]}
              >
                <Text style={styles.bannerText}>{b.title}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.pointsCard}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsBalance}>₱ {points}</Text>
              <Text style={styles.pointsLabel}>Points Balance</Text>
            </View>
            <TouchableOpacity style={styles.redeemBtn}>
              <Text style={styles.redeemText}>+ Redeem</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qrBtn}>
              <Ionicons name="qr-code-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Points Per Services */}
        <Text style={styles.sectionTitle}>Points per Services</Text>
        <View style={styles.servicesContainer}>
          {SERVICE_ITEMS.map((s) => (
            <View key={s.label} style={styles.serviceItem}>
              <Text style={styles.servicePoints}>{s.points}</Text>
              <Text style={styles.serviceLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Services Icons */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesRow}>
          <TouchableOpacity style={styles.serviceIcon}>
            <Ionicons name="car-sport" size={28} color="#666" />
            <Text style={styles.serviceIconLabel}>Car Repair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceIcon}>
            <Ionicons name="water" size={28} color="#666" />
            <Text style={styles.serviceIconLabel}>Car Wash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceIcon}>
            <Ionicons name="construct" size={28} color="#666" />
            <Text style={styles.serviceIconLabel}>Maintenance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceIcon}>
            <Ionicons name="flash" size={28} color="#666" />
            <Text style={styles.serviceIconLabel}>Tuning</Text>
          </TouchableOpacity>
        </View>

        {/* Latest Blogs */}
        <Text style={styles.sectionTitle}>Latest Blogs</Text>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  body: { paddingBottom: 20 },

  bannerWrap: { position: 'relative' },
  bannerScroll: { paddingVertical: 12 },
  banner: {
    width: width * 0.9,
    height: 160,
    borderRadius: 10,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: { fontSize: 18, fontWeight: '700', color: '#333' },

  pointsCard: {
    position: 'absolute',
    bottom: -30,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    elevation: 4,
  },
  pointsInfo: { flex: 1 },
  pointsBalance: { fontSize: 20, fontWeight: '700', color: '#333' },
  pointsLabel: { fontSize: 12, color: '#777' },
  redeemBtn: {
    backgroundColor: '#888',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  redeemText: { color: '#FFF', fontWeight: '600' },
  qrBtn: {
    backgroundColor: '#EEE',
    padding: 8,
    borderRadius: 8,
  },

  sectionTitle: {
    marginTop: 40,
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginHorizontal: 16,
  },
  serviceItem: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  servicePoints: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  serviceLabel: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },

  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 16,
  },
  serviceIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
  serviceIconLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },

  postContainer: {
    width: width * 0.7,
    marginHorizontal: 8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  postImage: { width: '100%', height: 120 },
  postTitle: { padding: 8, fontSize: 14, color: '#333', fontWeight: '600' },
});
