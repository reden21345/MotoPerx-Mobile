import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getUserGear } from "../../redux/actions/gearAction";

const GearSection = ({ title, items, showType }) => {
  if (!items?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemName}>{item.name}</Text>
          {showType && item[showType] && (
            <Text style={styles.itemType}>{item[showType]}</Text>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.images?.map((img, imgIndex) => (
              <Image
                key={imgIndex}
                source={{ uri: img.url }}
                style={styles.image}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

const MyGears = () => {
  const dispatch = useDispatch();
  const { gearDetails, loading, error } = useSelector((state) => state.gears);
  const { user } = useSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getUserGear()).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (user) {
      dispatch(getUserGear());
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.screenTitle}>Motor and Gears</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : gearDetails ? (
        <>
          <GearSection title="Motorcycle" items={gearDetails.motorcycle} showType="motorType" />
          <GearSection title="Helmets" items={gearDetails.helmets} showType="helmetType" />
          <GearSection title="Jackets" items={gearDetails.jackets} />
          <GearSection title="Gloves" items={gearDetails.gloves} />
          <GearSection title="Pants" items={gearDetails.pants} />
          <GearSection title="Boots" items={gearDetails.boots} />
          <GearSection title="Intercom" items={gearDetails.intercom} showType="brand" />
        </>
      ) : (
        <Text>No gear data found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  loader: {
    marginTop: 50,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemType: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
});

export default MyGears;
