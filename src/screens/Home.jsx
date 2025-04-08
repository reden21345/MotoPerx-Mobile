import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/authAction';
import { getQRCode } from '../redux/actions/qrcodeAction';

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch blog posts
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jabbre.shop/wp-json/wp/v2/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchPosts();

    // If you still want the QR code data, uncomment:
    // dispatch(getQRCode());
  }, [dispatch]);

  const openPost = (link) => {
    // Opens the blog post in the device’s default browser
    Linking.openURL(link);
  };

  // Renders each blog post item
  const renderPostItem = ({ item }) => {
    const title = item?.title?.rendered || 'No Title';
    const link = item?.link || '#';

    return (
      <TouchableOpacity 
        style={styles.postContainer} 
        onPress={() => openPost(link)}
      >
        <Image
          source={{ uri: 'https://via.placeholder.com/350x150' }}
          style={styles.postImage}
        />
        <Text style={styles.postTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* SCROLLABLE BODY */}
      <ScrollView contentContainerStyle={styles.bodyContainer}>
        {/* HORIZONTAL BANNERS (BEST CAR SERVICE + CAR WASH & DETAIL) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScrollContainer}
        >
          {/* FIRST BANNER: BEST CAR SERVICE */}
          <View style={styles.bannerItem}>
            {/* Background Image (Placeholder) */}
            <Image
              source={{ uri: 'https://via.placeholder.com/400x200?text=BEST+CAR+SERVICE' }}
              style={styles.bannerBg}
            />
            {/* “FREE CAR WASH” Bubble */}
            <View style={styles.freeCarWashBubble}>
              <Text style={styles.freeCarWashText}>FREE CAR WASH</Text>
            </View>
            {/* Text Overlay / Bullet Points */}
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

          {/* SECOND BANNER: CAR WASH & DETAIL */}
          <View style={styles.bannerItem}>
            <Image
              source={{ uri: 'https://via.placeholder.com/400x200?text=CAR+WASH+AND+DETAIL' }}
              style={styles.bannerBg}
            />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerMainText}>CAR WASH AND DETAIL</Text>
              <Text style={styles.bulletText}>• Standard Car Wash</Text>
              <Text style={styles.bulletText}>• Interior Cleaning</Text>
              <Text style={styles.bulletText}>• Full Services Wash</Text>
              <TouchableOpacity
                style={styles.contactUsBtn}
                onPress={() => console.log('Contact us pressed')}
              >
                <Text style={styles.contactUsBtnText}>CONTACT US</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* MOTOPERX POINTS BALANCE */}
        <View style={styles.pointsBalanceContainer}>
          <Text style={styles.pointsBalanceTitle}>MOTOPERX POINTS BALANCE</Text>
          <Text style={styles.pointsBalanceValue}>1,567</Text>
          <TouchableOpacity 
            style={styles.redeemButton}
            onPress={() => console.log('Redeem pressed')}
          >
            <Text style={styles.redeemButtonText}>REDEEM</Text>
          </TouchableOpacity>
        </View>

        {/* POINTS PER SERVICES */}
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsTitle}>POINTS PER SERVICES</Text>
          <View style={styles.pointsRow}>
            {/* Sample box #1 */}
            <View style={styles.pointBox}>
              <Text style={styles.pointValue}>10</Text>
              <Text style={styles.pointLabel}>CAR WASH</Text>
            </View>
            {/* Sample box #2 */}
            <View style={styles.pointBox}>
              <Text style={styles.pointValue}>10</Text>
              <Text style={styles.pointLabel}>OIL CHANGE</Text>
            </View>
            {/* Sample box #3 */}
            <View style={styles.pointBox}>
              <Text style={styles.pointValue}>10</Text>
              <Text style={styles.pointLabel}>TIRE</Text>
            </View>
            {/* Sample box #4 */}
            <View style={styles.pointBox}>
              <Text style={styles.pointValue}>10</Text>
              <Text style={styles.pointLabel}>OTHERS</Text>
            </View>
          </View>
        </View>

        {/* SERVICES SECTION */}
        <View style={styles.servicesContainer}>
          <View style={styles.servicesHeader}>
            <Text style={styles.servicesTitle}>SERVICES</Text>
            <TouchableOpacity onPress={() => console.log('View All pressed')}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesIconsRow}>
            {/* Sample service #1 */}
            <View style={styles.serviceBox}>
              <Ionicons name="car-sport" size={32} color="#000" />
              <Text style={styles.serviceLabel}>Car Repair</Text>
            </View>
            {/* Sample service #2 */}
            <View style={styles.serviceBox}>
              <Ionicons name="water" size={32} color="#000" />
              <Text style={styles.serviceLabel}>Car Wash</Text>
            </View>
            {/* Sample service #3 */}
            <View style={styles.serviceBox}>
              <Ionicons name="construct" size={32} color="#000" />
              <Text style={styles.serviceLabel}>Maintenance</Text>
            </View>
            {/* Sample service #4 */}
            <View style={styles.serviceBox}>
              <Ionicons name="flash" size={32} color="#000" />
              <Text style={styles.serviceLabel}>Tuning</Text>
            </View>
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

/* ======================
   STYLES
   ====================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  /****************
   * HEADER STYLES
   ****************/
  header: {
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerWelcome: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    flex: 1, // pushes profile icon to the far right
  },
  profileIconContainer: {
    padding: 5,
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
    overflow: 'hidden',
    backgroundColor: '#ccc',
    position: 'relative',
  },
  bannerBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerTextContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
  bannerMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  bulletPoints: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 4,
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  contactText: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#000',
  },
  freeCarWashBubble: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  freeCarWashText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 12,
  },
  contactUsBtn: {
    backgroundColor: '#ff0000',
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  contactUsBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /*****************************
   * MOTOPERX POINTS BALANCE
   *****************************/
  pointsBalanceContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  pointsBalanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pointsBalanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  redeemButton: {
    backgroundColor: '#000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  redeemButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /**********************
   * POINTS PER SERVICES
   **********************/
  pointsContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointBox: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 15,
  },
  pointValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  pointLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },

  /****************
   * SERVICES
   ****************/
  servicesContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  servicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007bff',
  },
  servicesIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  serviceBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceLabel: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blogList: {},
  postContainer: {
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    width: width * 0.8,
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  postTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
