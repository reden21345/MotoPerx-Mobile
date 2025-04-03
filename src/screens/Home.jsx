import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/authAction';
import { getQRCode } from '../redux/actions/qrcodeAction';
import QRCode from 'react-native-qrcode-svg';

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { qrCode } = useSelector((state) => state.qrCode);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Dispatch to get the QR Code (if not already fetched)
    dispatch(getQRCode());

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
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigation.replace('Login');
  };

  const openPost = (link) => {
    // Opens the blog post in the device’s default browser
    Linking.openURL(link);
  };

  const renderPostItem = ({ item }) => {
    const title = item?.title?.rendered || 'No Title';
    const link = item?.link || '#';

    return (
      <TouchableOpacity style={styles.postContainer} onPress={() => openPost(link)}>
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
      {/* REWARDS SECTION */}
      <View style={styles.rewardsContainer}>
        <Text style={styles.rewardsPoints}>1,567</Text>
        <Text style={styles.rewardsLabel}>Total Rewards Points</Text>
      </View>

      {/* QR CODE SECTION */}
      {/* {qrCode?.code ? (
        <View style={styles.qrCodeContainer}>
          <QRCode value={qrCode.code.toString()} size={150} />
          <Text style={styles.qrCodeLabel}>Scan Me!</Text>
        </View>
      ) : (
        <Text style={styles.qrCodePlaceholder}>QR Code Loading...</Text>
      )} */}

      {/* BLOG POSTS SECTION */}
      <Text style={styles.sectionTitle}>Latest Blog Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPostItem}
        style={styles.blogList}
      />

      {/* LOGOUT BUTTON */}
      {/* <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  /* REWARDS */
  rewardsContainer: {
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    paddingVertical: 20,
  },
  rewardsPoints: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  rewardsLabel: {
    fontSize: 16,
    color: '#777',
  },

  /* QR CODE */
  qrCodeContainer: {
    alignItems: 'center',
    padding: 10,
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignSelf: 'center',
  },
  qrCodeLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  qrCodePlaceholder: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    color: '#999',
  },

  /* BLOG LIST */
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  blogList: {
    paddingHorizontal: 16,
  },
  postContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  postTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
  },

  /* BUTTONS */
  button: {
    alignSelf: 'center',
    width: '80%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
