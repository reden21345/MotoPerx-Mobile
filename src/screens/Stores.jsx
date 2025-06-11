import React, { useState } from "react";
import {
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import PartnerItem from "../components/partners/PartnerComponent";

const AllPartners = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  const filteredProducts = products?.filter((prod) => {
    const matchesSearch = prod.storeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getAllProducts()).finally(() => setRefreshing(false));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>
      <Text style={styles.screenTitle}>PARTNER SHOPS</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by store name"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PartnerItem
            item={item}
            admin={false}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    borderRadius: 5,
    backgroundColor: "#98DB52",
    elevation: 2,
    shadowColor: "#000",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
});

export default AllPartners;
